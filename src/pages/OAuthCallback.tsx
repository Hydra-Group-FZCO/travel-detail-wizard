import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading, role, roleLoaded } = useAuth();

  useEffect(() => {
    if (loading || (user && !roleLoaded)) return;

    if (user) {
      const returnTo = sessionStorage.getItem("auth_return_to");
      sessionStorage.removeItem("auth_return_to");
      if (returnTo) {
        navigate(returnTo, { replace: true });
      } else if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [user, loading, roleLoaded, role, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
};

export default OAuthCallback;
