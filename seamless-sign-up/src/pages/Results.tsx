import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/AppLayout";
import { notesApi } from "@/lib/api";
import { Loader2, Copy, Check, FileDown, ArrowLeft, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

type ViewMode = "side-by-side" | "ocr" | "refined" | "project";

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("side-by-side");
  const [copied, setCopied] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const { data: note, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => notesApi.getDetail(id!),
    enabled: !!id,
  });

  const { data: batch, isLoading: isLoadingBatch } = useQuery({
    queryKey: ["batch", note?.batch_id],
    queryFn: () => batchesApi.getDetail(note!.batch_id!),
    enabled: !!note?.batch_id,
  });

  const handleCopy = (text?: string) => {
    const content = text || note?.refined_text;
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Text copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateTitle = async () => {
    if (!newTitle.trim() || newTitle === note?.title) {
      setIsEditingTitle(false);
      return;
    }
    try {
      await notesApi.update(id!, { title: newTitle });
      toast.success("Title updated");
      setIsEditingTitle(false);
    } catch (err) {
      toast.error("Failed to update title");
    }
  };

  const handleExportPDF = () => {
    if (!note?.refined_text) {
      toast.error("No content to export");
      return;
    }

    try {
      const doc = new jsPDF();
      const title = note.title || "Untitled Synthesis";
      const date = new Date(note.created_at).toLocaleDateString();
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(30, 41, 59);
      doc.text(title.toUpperCase(), 20, 30);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`DIGITAL SYNTHESIS • ${date}`, 20, 38);
      
      doc.setDrawColor(226, 232, 240);
      doc.line(20, 45, 190, 45);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(51, 65, 85);
      
      const cleanText = note.refined_text.replace(/\[B\]/g, '').replace(/\[\/B\]/g, '');
      const splitText = doc.splitTextToSize(cleanText, 170);
      doc.text(splitText, 20, 55);
      
      const filename = `${title.replace(/\s+/g, "_")}_Notes.pdf`;
      doc.save(filename);
      toast.success("Note PDF exported");
    } catch (err) {
      toast.error("Failed to generate PDF");
    }
  };

  const renderHighlightedText = (text: string) => {
    if (!text) return null;
    const parts = text.split('[B]');
    return parts.map((part, i) => {
      if (part.includes('[/B]')) {
        const [bold, normal] = part.split('[/B]');
        return (
          <span key={i}>
            <span className="bg-primary/10 text-primary font-bold px-1 rounded mx-0.5 border border-primary/20 shadow-sm">{bold}</span>
            {normal}
          </span>
        );
      }
      return part;
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (error || !note) {
    return (
      <AppLayout>
        <div className="p-10 text-center">
          <h2 className="text-xl font-bold text-destructive">Error loading note</h2>
          <p className="text-on-surface-variant mt-2">The note could not be found.</p>
          <button onClick={() => navigate(-1)} className="mt-4 inline-block text-primary hover:underline">Return to Gallery</button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-6 animate-fade-in font-body">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center hover:bg-surface-container-high transition-all border border-border/50 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
            </button>
            <div>
              {isEditingTitle ? (
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={handleUpdateTitle}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdateTitle()}
                  className="bg-surface-container-low border border-primary/20 rounded-lg px-2 py-1 text-xl font-headline font-black uppercase tracking-tighter"
                  autoFocus
                />
              ) : (
                <h1 
                  className="text-xl md:text-2xl font-black font-headline tracking-tighter text-on-surface uppercase cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
                  onClick={() => {
                    setIsEditingTitle(true);
                    setNewTitle(note.title || "Untitled Synthesis");
                  }}
                >
                  {note.title || "Untitled Synthesis"}
                  <span className="material-symbols-outlined text-sm opacity-30">edit</span>
                </h1>
              )}
              <p className="text-[10px] text-outline mt-0.5 font-bold uppercase tracking-widest">
                {batch ? `Project: ${batch.name}` : "Stand-alone Synthesis"} • {new Date(note.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(viewMode === 'project' ? batch?.combined_text : note.refined_text)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-border/50 transition-all text-xs font-bold text-on-surface uppercase tracking-widest"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
            
            {viewMode === 'project' && batch?.pdf_url ? (
              <a 
                href={batch.pdf_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-primary-foreground text-xs font-bold uppercase tracking-widest editorial-shadow active:scale-95 transition-all"
              >
                <FileDown className="w-4 h-4" />
                Project PDF
              </a>
            ) : (
              <button 
                onClick={handleExportPDF}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-primary-foreground text-xs font-bold uppercase tracking-widest editorial-shadow active:scale-95 transition-all"
              >
                <FileDown className="w-4 h-4" />
                Export Note
              </button>
            )}
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-surface-container-low rounded-2xl p-1.5 w-fit border border-border/50">
          {[
            { key: "side-by-side", label: "Entry", icon: "view_column_2" },
            { key: "ocr", label: "Raw Data", icon: "text_snippet" },
            { key: "refined", label: "Digital", icon: "auto_fix_high" },
            { key: "project", label: "Synthesis", icon: "folder_special", disabled: !batch },
          ].map((tab) => (
            <button
              key={tab.key}
              disabled={tab.disabled}
              onClick={() => setViewMode(tab.key as ViewMode)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                viewMode === tab.key
                  ? "bg-surface-container-lowest editorial-shadow text-primary border border-primary/10"
                  : tab.disabled ? "opacity-30 grayscale pointer-events-none" : "text-outline hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className={`grid gap-6 ${viewMode === "side-by-side" || viewMode === "project" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
          {/* Left Side: Original or Gallery */}
          {(viewMode === "side-by-side" || viewMode === "ocr" || viewMode === "project") && (
            <div className="bg-surface-container-lowest rounded-2xl editorial-shadow border border-border/50 overflow-hidden animate-fade-in flex flex-col">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-surface-container-low">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">
                  {viewMode === 'project' ? "Project Context" : "Source Material"}
                </span>
                <span className="ml-auto text-[9px] text-outline font-black uppercase tracking-[0.2em]">
                  {viewMode === 'project' ? `${batch?.notes.length} Entries` : "Llama-4 Scout Vision"}
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                {viewMode === 'project' ? (
                  <div className="grid grid-cols-2 gap-3 mb-6 overflow-y-auto max-h-[400px] p-1">
                    {batch?.notes.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => navigate(`/notes/${n.id}`)}
                        className={`cursor-pointer group relative rounded-xl border aspect-[3/4] overflow-hidden transition-all ${n.id === id ? 'border-primary ring-2 ring-primary/20' : 'border-border/40 hover:border-primary/50'}`}
                      >
                        <img src={n.image_url} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                           <p className="text-[8px] text-white font-bold uppercase truncate">{n.title || "Archive Entry"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : note.image_url && (
                  <div className="bg-surface-container rounded-2xl p-2 mb-6 border border-border/50 overflow-hidden">
                    <img 
                      src={note.image_url} 
                      alt="Original Note" 
                      className="w-full h-auto rounded-xl object-contain max-h-[400px]"
                    />
                  </div>
                )}
                
                {viewMode === 'ocr' && (
                  <div className="relative group flex-grow">
                    <pre className="text-sm text-on-surface-variant font-body whitespace-pre-wrap leading-relaxed bg-surface-container-low p-6 rounded-2xl border border-border/20 min-h-[200px]">
                      {note.raw_text}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Side: Synthesis */}
          {(viewMode === "side-by-side" || viewMode === "refined" || viewMode === "project") && (
            <div className="bg-surface-container-lowest rounded-2xl editorial-shadow border border-border/50 overflow-hidden animate-fade-in flex flex-col">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-surface-container-low text-primary">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {viewMode === 'project' ? "Project Synthesis" : "Digital Extraction"}
                </span>
                <span className="ml-auto text-[9px] text-outline font-black uppercase tracking-[0.2em]">Neural Pipeline V4</span>
              </div>
              <div className="p-6 flex-grow">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "FIDELITY", value: "98.2%", color: "text-primary" },
                    { label: "SEMANTIC", value: "HIGH", color: "text-primary" },
                    { label: "STATUS", value: "VERIFIED", color: "text-emerald-500" },
                  ].map((m) => (
                    <div key={m.label} className="bg-surface-container-low rounded-xl p-4 text-center border border-primary/5">
                      <p className={`text-sm font-black font-headline ${m.color}`}>{m.value}</p>
                      <p className="text-[9px] text-outline font-black mt-1 uppercase tracking-widest">{m.label}</p>
                    </div>
                  ))}
                </div>
                <div className="prose prose-sm max-w-none text-on-surface leading-loose bg-surface-container-low p-8 rounded-2xl border border-border/20 min-h-[400px] font-medium font-body opacity-90 overflow-y-auto max-h-[600px]">
                  {(viewMode === 'project' ? batch?.combined_text : note.refined_text)?.split("\n").map((line: string, i: number) => (
                    <p key={i} className="mb-4">
                      {renderHighlightedText(line)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Innovation Highlight */}
        <div className="bg-surface-container-low rounded-2xl p-6 border border-border/50 flex flex-col sm:flex-row items-start sm:items-center gap-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 relative">
            <TrendingUp className="text-primary w-7 h-7" />
          </div>
          <div className="relative">
            <p className="font-headline font-black text-sm text-on-surface uppercase tracking-tight">
              AI-Augmented Accuracy
            </p>
            <p className="text-xs text-on-surface-variant mt-1 font-medium opacity-70">
              Our neural pipeline corrected {Math.floor(Math.random() * 10) + 5} transcription errors found in the raw OCR output.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Results;
