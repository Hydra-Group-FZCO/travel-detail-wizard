import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type AppRole = "customer" | "admin";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: AppRole;
  loading: boolean;
  roleLoaded: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole>("customer");
  const [loading, setLoading] = useState(true);
  const [roleLoaded, setRoleLoaded] = useState(false);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    setProfile(data);
    return data;
  };

  const fetchRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();
    setRole((data?.role as AppRole) || "customer");
    setRoleLoaded(true);
  };

  /** Links a Stripe customer when the profile has no stripe_customer_id (idempotent on the server). */
  const ensureStripeCustomer = async (userId: string, profileSnapshot: Profile | null) => {
    if (profileSnapshot?.stripe_customer_id) return;
    try {
      // supabase-js uses the publishable/anon key as Bearer when there is no session — that is not a user JWT
      // and triggers "Invalid JWT" on the functions gateway when verify_jwt is on. Always send a real access token.
      const accessTokenLooksLikeJwt = (t: string) => t.split(".").length === 3;
      const invoke = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        let token = session?.access_token;
        if (!token || !accessTokenLooksLikeJwt(token)) {
          const { data: refreshed } = await supabase.auth.refreshSession();
          token = refreshed.session?.access_token;
        }
        if (!token || !accessTokenLooksLikeJwt(token)) {
          return {
            data: null,
            error: Object.assign(new Error("No valid access token"), { name: "AuthSessionMissing" }),
          };
        }
        return supabase.functions.invoke("create-stripe-customer", {
          headers: { Authorization: `Bearer ${token}` },
        });
      };

      let { data, error } = await invoke();
      if (error) {
        await supabase.auth.refreshSession();
        await new Promise((r) => setTimeout(r, 400));
        ({ data, error } = await invoke());
      }
      // Retry once more: profile row can lag behind auth (trigger race) or transient edge errors.
      if (error) {
        await new Promise((r) => setTimeout(r, 1200));
        ({ data, error } = await invoke());
      }
      if (error) {
        const msg =
          data && typeof data === "object" && "error" in data
            ? String((data as { error: unknown }).error)
            : error.message;
        console.error("create-stripe-customer:", msg);
        return;
      }
      await fetchProfile(userId);
    } catch (e) {
      console.error("Stripe customer creation failed:", e);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await Promise.all([fetchProfile(user.id), fetchRole(user.id)]);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(async () => {
            const [profileData] = await Promise.all([
              fetchProfile(session.user.id),
              fetchRole(session.user.id),
            ]);
            await ensureStripeCustomer(session.user.id, profileData);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setRole("customer");
          setRoleLoaded(true);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const [profileData] = await Promise.all([
          fetchProfile(session.user.id),
          fetchRole(session.user.id),
        ]);
        await ensureStripeCustomer(session.user.id, profileData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, role, loading, roleLoaded, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
