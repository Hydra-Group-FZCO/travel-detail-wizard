import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import {
  Globe, Download, Share2, Wifi, Shield, Loader2, Sparkles,
  Copy, Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { downloadMarkdownAsPdf } from "@/lib/downloadPdf";

const LOADING_MESSAGES = [
  "Researching your destination...",
  "Planning your days...",
  "Finding hidden gems...",
  "Adding local secrets...",
  "Crafting recommendations...",
  "Almost ready...",
];

const ItineraryView = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [itinerary, setItinerary] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Rotate loading messages
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
      // Fetch itinerary
      const { data, error } = await supabase
        .from("itineraries")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        toast({ title: "Error", description: "Itinerary not found", variant: "destructive" });
        return;
      }

      setItinerary(data);

      // If already completed, show content
      if (data.status === "completed" && data.content_markdown) {
        setContent(data.content_markdown);
        return;
      }

      // If pending, trigger generation
      if (data.status === "pending" || data.status === "generating") {
        setIsGenerating(true);
        try {
          const session = await supabase.auth.getSession();
          const token = session.data.session?.access_token;

          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-itinerary`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              },
              body: JSON.stringify({ itinerary_id: id }),
            }
          );

          if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || "Generation failed");
          }

          // Stream response
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

          // Refresh itinerary data
          const { data: updated } = await supabase
            .from("itineraries")
            .select("*")
            .eq("id", id)
            .single();
          if (updated) setItinerary(updated);
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
    if (!itinerary?.public_share_token) return;
    const url = `${window.location.origin}/itinerary/${itinerary.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ title: "Link copied!", description: "Share this link with anyone" });
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse markdown into day sections — supports "## Day X:", "## Día X:", "## Jour X:", "## Tag X:", "## Giorno X:", etc.
  const parseDays = (md: string) => {
    const dayRegex = /## (?:Day|Día|Jour|Tag|Giorno|Dia) (\d+):\s*(.+)/g;
    const days: { num: string; title: string; content: string }[] = [];
    let match;
    const indices: { start: number; num: string; title: string }[] = [];

    while ((match = dayRegex.exec(md)) !== null) {
      indices.push({ start: match.index, num: match[1], title: match[2] });
    }

    for (let i = 0; i < indices.length; i++) {
      const end = i < indices.length - 1 ? indices[i + 1].start : md.length;
      const sectionContent = md.slice(indices[i].start, end);
      days.push({ num: indices[i].num, title: indices[i].title, content: sectionContent });
    }

    return days;
  };

  // Simple markdown to HTML
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
      .replace(/^💡 (.+)$/gm, '<div class="bg-primary/5 border border-primary/20 rounded-lg p-3 my-3 text-sm">💡 $1</div>')
      .replace(/^---$/gm, '<hr class="my-6 border-border" />')
      .replace(/\n\n/g, "<br/>");

    // Wrap table rows
    if (html.includes("<tr>")) {
      html = html.replace(
        /(<tr>.*?<\/tr>)+/gs,
        '<table class="w-full border-collapse my-4">$&</table>'
      );
    }

    return html;
  };

  const days = content ? parseDays(content) : [];

  // Get header content (before first day)
  const firstDayIdx = content.indexOf("## Day ");
  const headerContent = firstDayIdx > 0 ? content.slice(0, firstDayIdx) : "";

  // Get footer content (after last day section)
  const lastDayEnd = days.length > 0 ? (() => {
    const lastDay = days[days.length - 1];
    const idx = content.lastIndexOf(lastDay.content);
    return idx + lastDay.content.length;
  })() : content.length;
  const footerContent = content.slice(lastDayEnd);

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        {/* Generating state */}
        {isGenerating && !content && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <Globe className="w-10 h-10 text-primary animate-spin" style={{ animationDuration: "3s" }} />
              </div>
              <Sparkles className="w-6 h-6 text-primary absolute -top-1 -right-1 animate-bounce" />
            </div>
            <p className="text-lg font-medium text-foreground animate-pulse">
              {LOADING_MESSAGES[loadingMsgIdx]}
            </p>
            <p className="text-sm text-muted-foreground mt-2">This takes about 30-60 seconds</p>
          </div>
        )}

        {/* Content */}
        {content && (
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main content */}
              <div className="flex-1 min-w-0">
                {/* Header branding */}
                <div className="mb-8 pb-6 border-b border-border">
                  <Badge variant="secondary" className="mb-3">
                    <Sparkles className="w-3 h-3 mr-1" /> AI-Generated Itinerary
                  </Badge>
                  <h1 className="text-3xl font-bold text-foreground mb-1">
                    {itinerary?.destination}
                  </h1>
                  <p className="text-muted-foreground">
                    {itinerary?.num_days} days · {itinerary?.trip_type} · {itinerary?.budget_level}
                  </p>
                  {isGenerating && (
                    <div className="flex items-center gap-2 mt-3 text-primary text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Still generating...
                    </div>
                  )}
                </div>

                {/* Header section */}
                {headerContent && (
                  <div
                    className="prose prose-sm max-w-none mb-8"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(headerContent) }}
                  />
                )}

                {/* Day-by-day accordion */}
                {days.length > 0 && (
                  <Accordion type="multiple" defaultValue={days.map((d) => d.num)} className="space-y-3">
                    {days.map((day) => (
                      <AccordionItem
                        key={day.num}
                        value={day.num}
                        className="border rounded-lg overflow-hidden bg-card"
                      >
                        <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
                          <div className="flex items-center gap-3 text-left">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-primary">{day.num}</span>
                            </div>
                            <div>
                              <div className="font-semibold text-foreground">Day {day.num}</div>
                              <div className="text-sm text-muted-foreground">{day.title}</div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-5">
                          <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: renderMarkdown(
                                day.content.replace(/^## Day \d+:.+\n?/, "")
                              ),
                            }}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}

                {/* Footer sections */}
                {footerContent && (
                  <div
                    className="prose prose-sm max-w-none mt-8"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(footerContent) }}
                  />
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:w-72 shrink-0">
                <div className="sticky top-24 space-y-4">
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() =>
                          downloadMarkdownAsPdf(
                            content,
                            `${itinerary?.destination} Itinerary`,
                            `${itinerary?.num_days} days · ${itinerary?.trip_type} · ${itinerary?.budget_level}`
                          )
                        }
                      >
                        <Download className="w-4 h-4 mr-2" /> Download PDF
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleShare}
                      >
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                        {copied ? "Copied!" : "Share itinerary"}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Upsell */}
                  {itinerary?.destination && (
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="p-4 space-y-3">
                        <h3 className="font-semibold text-foreground text-sm">
                          Complete your trip to {itinerary.destination}
                        </h3>
                        <Link to="/esims">
                          <Button variant="outline" size="sm" className="w-full justify-start mb-2">
                            <Wifi className="w-4 h-4 mr-2" /> Get an eSIM
                          </Button>
                        </Link>
                        <Link to="/services">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Shield className="w-4 h-4 mr-2" /> Travel services
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ItineraryView;
