import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import {
  Globe, Share2, Wifi, Shield, Loader2, Sparkles,
  Check, BookOpen, MapPin, Plane
} from "lucide-react";
import { cn } from "@/lib/utils";

const LOADING_MESSAGES = [
  "Researching your destination...",
  "Gathering insider tips...",
  "Writing your guide...",
  "Adding local recommendations...",
  "Checking latest info...",
  "Almost done...",
];

const GuideView = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [guide, setGuide] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      setReadProgress(Math.min(100, (scrolled / total) * 100));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [content]);

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    if (!id) return;

    const fetchAndGenerate = async () => {
      const { data, error } = await supabase
        .from("travel_guides")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        toast({ title: "Error", description: "Guide not found", variant: "destructive" });
        return;
      }

      setGuide(data);

      if (data.status === "completed" && data.content_markdown) {
        setContent(data.content_markdown);
        return;
      }

      if (data.status === "pending" || data.status === "generating") {
        setIsGenerating(true);
        try {
          const session = await supabase.auth.getSession();
          const token = session.data.session?.access_token;

          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-guide`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              },
              body: JSON.stringify({ guide_id: id }),
            }
          );

          if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || "Generation failed");
          }

          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let fullContent = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            let newlineIdx: number;

            while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
              let line = buffer.slice(0, newlineIdx);
              buffer = buffer.slice(newlineIdx + 1);

              if (line.endsWith("\r")) line = line.slice(0, -1);
              if (!line.startsWith("data: ")) continue;

              const jsonStr = line.slice(6).trim();
              if (jsonStr === "[DONE]") break;

              try {
                const parsed = JSON.parse(jsonStr);
                if (parsed.content) {
                  fullContent += parsed.content;
                  setContent(fullContent);
                }
              } catch {
                buffer = line + "\n" + buffer;
                break;
              }
            }
          }

          setIsGenerating(false);
          const { data: updated } = await supabase
            .from("travel_guides")
            .select("*")
            .eq("id", id)
            .single();
          if (updated) setGuide(updated);
        } catch (err: any) {
          console.error("Generation error:", err);
          toast({ title: "Error", description: err.message, variant: "destructive" });
          setIsGenerating(false);
        }
      }
    };

    fetchAndGenerate();
  }, [id]);

  const handleShare = async () => {
    if (!guide?.public_share_token) return;
    const url = `${window.location.origin}/travel-guides/view/${guide.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ title: "Link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse sections from markdown
  const sections = useMemo(() => {
    if (!content) return [];
    const regex = /^## (.+)$/gm;
    const result: { title: string; id: string; content: string }[] = [];
    const indices: { start: number; title: string }[] = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      indices.push({ start: match.index, title: match[1] });
    }

    for (let i = 0; i < indices.length; i++) {
      const end = i < indices.length - 1 ? indices[i + 1].start : content.length;
      const sectionContent = content.slice(indices[i].start, end);
      const id = indices[i].title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
      result.push({ title: indices[i].title, id, content: sectionContent });
    }

    return result;
  }, [content]);

  const renderMarkdown = (md: string) => {
    let html = md
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-6 mb-2 text-foreground">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3 text-foreground">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4 text-foreground">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\|(.+)$/gm, (match) => {
        const cells = match.split("|").filter(Boolean).map((c) => c.trim());
        if (cells.every((c) => /^-+$/.test(c))) return "";
        const tag = cells.some((c) => c.startsWith("**")) ? "th" : "td";
        return `<tr>${cells.map((c) => `<${tag} class="border border-border px-3 py-1.5 text-sm">${c}</${tag}>`).join("")}</tr>`;
      })
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-sm text-foreground/90">$1</li>')
      .replace(/^⚡ (.+)$/gm, '<div class="bg-accent/10 border border-accent/20 rounded-lg p-3 my-3 text-sm">⚡ $1</div>')
      .replace(/^---$/gm, '<hr class="my-6 border-border" />')
      .replace(/\n\n/g, "<br/>");

    if (html.includes("<tr>")) {
      html = html.replace(/(<tr>.*?<\/tr>)+/gs, '<table class="w-full border-collapse my-4">$&</table>');
    }
    return html;
  };

  // Header content (before first ## section)
  const firstSectionIdx = content.indexOf("## ");
  const headerContent = firstSectionIdx > 0 ? content.slice(0, firstSectionIdx) : "";

  return (
    <PageLayout>
      {/* Reading progress bar */}
      {content && (
        <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-muted">
          <div className="h-full bg-primary transition-all duration-150" style={{ width: `${readProgress}%` }} />
        </div>
      )}

      <div className="min-h-screen bg-background">
        {/* Loading */}
        {isGenerating && !content && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <BookOpen className="w-10 h-10 text-primary animate-bounce" style={{ animationDuration: "2s" }} />
              </div>
              <Sparkles className="w-6 h-6 text-primary absolute -top-1 -right-1 animate-bounce" />
            </div>
            <p className="text-lg font-medium text-foreground animate-pulse">
              {LOADING_MESSAGES[loadingMsgIdx]}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {guide?.depth === "ultimate" ? "This may take 2-3 minutes for an Ultimate guide" : "This takes about 30-90 seconds"}
            </p>
          </div>
        )}

        {/* Content */}
        {content && (
          <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* TOC sidebar */}
              <div className="lg:w-56 shrink-0 order-2 lg:order-1">
                <div className="sticky top-16 space-y-4">
                  <Card>
                    <CardContent className="p-3">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Contents</h3>
                      <nav className="space-y-0.5 max-h-[60vh] overflow-y-auto">
                        {sections.map((s) => (
                          <a
                            key={s.id}
                            href={`#${s.id}`}
                            className="block text-xs text-muted-foreground hover:text-primary py-1 px-2 rounded hover:bg-muted transition-colors truncate"
                          >
                            {s.title.replace(/^[^\s]+ /, "")}
                          </a>
                        ))}
                      </nav>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-3 space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start text-xs" onClick={handleShare}>
                        {copied ? <Check className="w-3 h-3 mr-1.5" /> : <Share2 className="w-3 h-3 mr-1.5" />}
                        {copied ? "Copied!" : "Share guide"}
                      </Button>
                    </CardContent>
                  </Card>

                  {guide?.destination && (
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="p-3 space-y-2">
                        <h4 className="font-semibold text-foreground text-xs">Complete your trip</h4>
                        <Link to="/esims">
                          <Button variant="outline" size="sm" className="w-full justify-start text-xs mb-1.5">
                            <Wifi className="w-3 h-3 mr-1.5" /> Get eSIM
                          </Button>
                        </Link>
                        <Link to="/itinerary-generator">
                          <Button variant="outline" size="sm" className="w-full justify-start text-xs mb-1.5">
                            <MapPin className="w-3 h-3 mr-1.5" /> AI Itinerary
                          </Button>
                        </Link>
                        <Link to="/services">
                          <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                            <Shield className="w-3 h-3 mr-1.5" /> Travel services
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0 order-1 lg:order-2" ref={contentRef}>
                <div className="mb-8 pb-6 border-b border-border">
                  <Badge variant="secondary" className="mb-3">
                    <BookOpen className="w-3 h-3 mr-1" /> AI-Generated Guide
                    {guide?.depth && <span className="ml-1.5 capitalize">· {guide.depth}</span>}
                  </Badge>
                  <h1 className="text-3xl font-bold text-foreground mb-1">{guide?.destination} Travel Guide</h1>
                  <p className="text-muted-foreground text-sm">
                    {guide?.word_count ? `${guide.word_count.toLocaleString()} words · ` : ""}
                    {guide?.season !== "unknown" && `${guide?.season} · `}
                    Generated by Digital Moonkey Travel
                  </p>
                  {isGenerating && (
                    <div className="flex items-center gap-2 mt-3 text-primary text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" /> Still generating...
                    </div>
                  )}
                </div>

                {/* Header */}
                {headerContent && (
                  <div className="prose prose-sm max-w-none mb-8" dangerouslySetInnerHTML={{ __html: renderMarkdown(headerContent) }} />
                )}

                {/* Sections as accordion */}
                {sections.length > 0 && (
                  <Accordion type="multiple" defaultValue={sections.map((s) => s.id)} className="space-y-3">
                    {sections.map((section) => (
                      <AccordionItem
                        key={section.id}
                        value={section.id}
                        id={section.id}
                        className="border rounded-lg overflow-hidden bg-card"
                      >
                        <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
                          <span className="font-semibold text-foreground text-left">{section.title}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-5">
                          <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: renderMarkdown(section.content.replace(/^## .+\n?/, "")),
                            }}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default GuideView;
