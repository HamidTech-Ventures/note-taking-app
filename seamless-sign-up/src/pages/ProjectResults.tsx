import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/AppLayout";
import { batchesApi } from "@/lib/api";
import { 
  FileDown, 
  ChevronLeft, 
  Sparkles, 
  FileText, 
  Layers, 
  ExternalLink,
  Loader2,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * PROJECT RESULTS - SINGLE SCREEN DOSSIER
 * This page fulfills the requirement of showing ALL images + their text in one screen.
 * It is optimized for batch review and instant professional PDF export.
 */
const ProjectResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: batch, isLoading, error } = useQuery({
    queryKey: ["batch", id],
    queryFn: () => batchesApi.getDetail(id as string),
    enabled: !!id,
    refetchInterval: (data) => (data?.status === "processing" ? 3000 : false),
  });

  const handleExportPDF = async () => {
    if (!id) return;
    
    try {
      const token = sessionStorage.getItem("auth_token");
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      
      // Call our proxy endpoint to avoid CORS and force download headers
      const response = await fetch(`${BASE_URL}/notes/batches/${id}/download`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error("Synthesis archive not ready or access denied.");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `${batch?.name || 'digital_note'}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      // Last resort fallback - open source URL directly
      if (batch?.pdf_url) window.open(batch.pdf_url, '_blank');
    }
  };

  const renderHighlightedText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\[B\].*?\[\/B\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[B]') && part.endsWith('[/B]')) {
        return (
          <span key={i} className="bg-primary/10 text-primary font-bold px-1 rounded">
            {part.substring(3, part.length - 4)}
          </span>
        );
      }
      return part;
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center font-headline">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-6" />
          <p className="text-xl font-black uppercase tracking-[0.2em]">Assembling Intelligence Dossier...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !batch) {
    return (
      <AppLayout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
          <p className="text-destructive font-bold">Failed to load project archives.</p>
          <Button onClick={() => navigate('/history')} variant="link">Return to Neural Vault</Button>
        </div>
      </AppLayout>
    );
  }

  const wordCount = batch.notes.reduce((acc: number, n: any) => acc + (n.refined_text?.split(/\s+/).length || 0), 0);

  return (
    <AppLayout>
      <div className="relative min-h-screen bg-surface-container-lowest font-body">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-border/50 px-6 py-4 editorial-shadow">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/history')}
                className="w-10 h-10 rounded-xl hover:bg-surface-container-low flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Project Dossier</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h1 className="text-xl md:text-2xl font-black font-headline tracking-tighter text-on-surface uppercase leading-none truncate max-w-[300px]">
                  {batch.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/upload?batch_id=${batch.id}`)}
                className="hidden md:flex rounded-2xl border-border/50 font-black uppercase tracking-[0.2em] text-[10px] px-6 h-14 hover:bg-surface-container-high transition-all"
              >
                Add More Pages
              </Button>
              <div className="hidden lg:flex items-center gap-4 mr-4 text-outline font-black text-[10px] uppercase tracking-widest border-r border-border/50 pr-4">
                 <div className="flex flex-col items-end">
                    <span>{batch.notes.length} PAGES</span>
                    <span>{wordCount} WORDS</span>
                 </div>
              </div>
              <Button 
                onClick={handleExportPDF}
                disabled={!batch.pdf_url}
                className="rounded-2xl bg-on-surface text-surface hover:bg-primary font-black uppercase tracking-[0.2em] text-[11px] px-8 h-14 editorial-shadow active:scale-95 transition-all gap-3"
              >
                <FileDown className="w-5 h-5" />
                {batch.pdf_url ? "Export Professional PDF" : "Generating PDF..."}
              </Button>
            </div>
          </div>
        </header>

        {/* Dossier Content */}
        <main className="max-w-6xl mx-auto px-6 py-12 space-y-24">
          
          {/* Executive Summary / Synthesis View */}
          <section className="bg-surface-container-low rounded-[3rem] p-8 md:p-16 border border-primary/5 editorial-shadow animate-fade-in">
             <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                   <Layers className="w-6 h-6" />
                </div>
                <div>
                   <h2 className="text-2xl font-black font-headline text-on-surface uppercase tracking-tight">Consolidated Synthesis</h2>
                   <p className="text-[10px] text-outline font-black uppercase tracking-widest mt-1">Cross-Document Intelligence Analysis</p>
                </div>
             </div>
             
             <div className="prose prose-lg max-w-none text-on-surface leading-loose font-medium opacity-90 italic">
                {batch.combined_text?.split('\n').map((line: string, i: number) => (
                  <p key={i} className="mb-4">{renderHighlightedText(line)}</p>
                ))}
             </div>
          </section>

          {/* Sequential Document Breakdown */}
          <div className="space-y-32">
            <div className="flex items-center gap-4">
                <h3 className="text-xs font-black text-outline uppercase tracking-[0.4em]">Archival Evidence Breakdown</h3>
                <div className="h-px flex-1 bg-surface-container-high" />
            </div>

            {batch.notes.map((note: any, index: number) => (
              <div key={note.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start group">
                {/* Left: Source Material */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-black font-headline text-primary opacity-20">0{index + 1}</span>
                      <span className="text-[10px] font-black text-outline uppercase tracking-widest">Original Capture</span>
                    </div>
                    <button 
                      onClick={() => window.open(note.image_url, '_blank')}
                      className="text-[9px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest flex items-center gap-1"
                    >
                      Inspect Source <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="bg-surface-container-low rounded-3xl p-2 border border-border/40 overflow-hidden editorial-shadow group-hover:border-primary/20 transition-all">
                    <img 
                      src={note.image_url} 
                      alt={`Document ${index + 1}`} 
                      className="w-full h-auto rounded-2xl grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 max-h-[600px] object-contain"
                    />
                  </div>
                </div>

                {/* Right: Digital Extraction */}
                <div className="lg:pt-14 space-y-6">
                  <div className="bg-surface-container-highest/20 rounded-2xl p-6 border border-border/10">
                     <div className="flex items-center gap-3 mb-4 text-emerald-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Neural Verification Complete</span>
                     </div>
                     <h4 className="text-xl font-black font-headline text-on-surface uppercase tracking-tight mb-6">
                       {note.title || `Entry Identification #${index + 1}`}
                     </h4>
                     <div className="prose prose-sm max-w-none text-on-surface-variant leading-relaxed font-body text-base">
                        {note.refined_text?.split('\n').map((line: string, i: number) => (
                          <p key={i} className="mb-3">{renderHighlightedText(line)}</p>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <footer className="pt-20 pb-32 border-t border-border/50 flex flex-col items-center text-center">
             <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
             </div>
             <h3 className="text-2xl font-black font-headline text-on-surface uppercase tracking-tight">Archives Sealed</h3>
             <p className="text-on-surface-variant text-sm mt-2 max-w-md mx-auto font-medium opacity-60">
               This project has been fully digitized and cryptographically timestamped in your neural vault.
             </p>
             <div className="flex gap-4 mt-10">
                <Button 
                  onClick={handleExportPDF}
                  disabled={!batch.pdf_url}
                  className="rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[11px] px-10 h-14 editorial-shadow"
                >
                  Download Report
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/upload')}
                  className="rounded-2xl border-border/50 font-black uppercase tracking-widest text-[11px] px-10 h-14"
                >
                  New Collection
                </Button>
             </div>
          </footer>
        </main>
      </div>
    </AppLayout>
  );
};

export default ProjectResults;
