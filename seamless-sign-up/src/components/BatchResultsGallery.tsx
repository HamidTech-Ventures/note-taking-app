import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Check, 
  Copy, 
  ArrowRight, 
  Sparkles, 
  LayoutGrid, 
  History as HistoryIcon,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ProcessedNote {
  id: string;
  title: string;
  refined_text: string;
  image_url?: string;
  created_at: string;
  batch_id?: string;
}

interface BatchResultsGalleryProps {
  results: ProcessedNote[];
  onReset: () => void;
}

const BatchResultsGallery = ({ results, onReset }: BatchResultsGalleryProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Text copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Project Synthesis Finalized</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-headline tracking-tighter text-on-surface uppercase leading-none">
            Digital <span className="text-outline">Collection</span>
          </h1>
          <p className="text-on-surface-variant text-[12px] mt-2 font-medium opacity-70 max-w-lg leading-relaxed uppercase tracking-[0.05em]">
            Your handwritten notes have been synthesized into a unified digital project. Explore the final report below.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={onReset}
            className="rounded-xl border-dashed border-border/50 hover:bg-surface-container-low font-black uppercase tracking-widest text-[9px] px-5 h-12"
          >
            Reset Queue
          </Button>
          <Link to={results.length > 0 ? `/projects/${results[0].batch_id}` : "/history"}>
            <Button className="rounded-xl bg-on-surface text-surface hover:bg-primary font-black uppercase tracking-[0.2em] text-[10px] px-6 h-12 editorial-shadow active:scale-95 transition-all">
              Open Full Digital Note
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {results.map((note, index) => (
          <Card 
            key={note.id} 
            className="group relative bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow border border-border/50 hover:border-primary/30 transition-all duration-500 animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Note Thumbnail / Image Header */}
            <div className="h-32 bg-surface-container-low relative overflow-hidden">
                {note.image_url ? (
                  <img 
                    src={note.image_url} 
                    alt={note.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5">
                    <Search className="w-10 h-10 text-primary/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <div className="bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border/40 text-[9px] font-black text-on-surface uppercase tracking-widest">
                    NOTE #{index + 1}
                  </div>
                </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-headline font-black text-lg text-on-surface uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                  {note.title || "Untitled Synthesis"}
                </h3>
                <p className="text-[9px] text-outline font-black uppercase tracking-[0.2em] mt-1">
                  Synthesized {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="relative">
                <div className="bg-surface-container-low rounded-xl p-4 min-h-[100px] max-h-[100px] overflow-hidden">
                  <p className="text-xs text-on-surface-variant font-medium leading-relaxed opacity-80 line-clamp-4 italic">
                    "{note.refined_text}"
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface-container-low to-transparent" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCopy(note.refined_text, note.id)}
                  className="flex-1 rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-all text-[9px] font-black uppercase tracking-widest h-10"
                >
                  {copiedId === note.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-2 text-emerald-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Link to={`/results/${note.id}`} className="flex-1">
                  <Button
                    size="sm"
                    className="w-full rounded-xl bg-on-surface text-surface text-[9px] font-black uppercase tracking-widest h-10 hover:bg-primary transition-all shadow-lg active:scale-95"
                  >
                    Details
                    <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BatchResultsGallery;
