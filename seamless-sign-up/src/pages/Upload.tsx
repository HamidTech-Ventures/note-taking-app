import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import BatchResultsGallery from "@/components/BatchResultsGallery";
import { notesApi, batchesApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, FolderPlus, FolderOpen, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Batch {
  id: string;
  name: string;
  created_at: string;
}

interface ProcessedNote {
  id: string;
  title: string;
  refined_text: string;
  image_url?: string;
  created_at: string;
  batch_id?: string;
}

const Upload = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [results, setResults] = useState<ProcessedNote[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  
  // Batch/Project State
  const [existingBatches, setExistingBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(searchParams.get("batch_id"));
  const [isNewProject, setIsNewProject] = useState(!searchParams.get("batch_id"));

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await batchesApi.getList();
        setExistingBatches(data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };
    fetchBatches();
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;

    setProcessing(true);
    setOverallProgress(0);
    const processedResults: ProcessedNote[] = [];

    try {
      // Determine batch ID once at start for the whole batch
      let currentBatchId = isNewProject ? null : selectedBatchId;

      for (let i = 0; i < files.length; i++) {
        setCurrentFileIndex(i);
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        if (currentBatchId) {
          formData.append("batch_id", currentBatchId);
        }

        // Process file
        const result = await notesApi.process(formData);
        processedResults.push(result);
        
        // If we just started a new project, capture the ID from the first result
        if (!currentBatchId && result.batch_id) {
          currentBatchId = result.batch_id;
        }

        // Update progress
        const progress = Math.round(((i + 1) / files.length) * 100);
        setOverallProgress(progress);
        
        toast.success(`Synthesized: ${file.name}`, { duration: 1500 });
      }

      // Restore interactive review mode as requested (keeping one-by-one processing visible)
      setResults(processedResults);
      setTimeout(() => {
        setProcessing(false);
        setIsReviewMode(true);
        toast.success("All pages synthesized successfully!");
      }, 800);

    } catch (error: any) {
      toast.error(error.message || "An error occurred during processing.");
      setProcessing(false);
    }
  };

  const resetUpload = () => {
    setFiles([]);
    setResults([]);
    setIsReviewMode(false);
    setProcessing(false);
    setOverallProgress(0);
  };

  const currentStage = 
    overallProgress < 25 ? "Initializing Neural Pipeline..." :
    overallProgress < 75 ? `Processing Document ${currentFileIndex + 1} of ${files.length}...` :
    overallProgress < 100 ? "Assembling Digital Library..." : 
    "Synthesis Complete!";

  return (
    <AppLayout>
      <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-6 animate-fade-in font-body">
        
        {/* Progress Header (Only show when processing) */}
        {processing && (
            <div className="fixed top-0 left-0 right-0 h-1 bg-surface-container z-50">
                <div 
                    className="h-full bg-primary transition-all duration-500 ease-out" 
                    style={{ width: `${overallProgress}%` }}
                />
            </div>
        )}

        {isReviewMode ? (
          /* REVIEW MODE: Interactive Gallery */
          <BatchResultsGallery results={results} onReset={resetUpload} />
        ) : !processing ? (
          /* UPLOAD MODE: Dropzone & File List */
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-black font-headline tracking-tighter text-on-surface uppercase leading-none">
                  Neural <span className="text-outline">Sync</span>
                </h1>
                <p className="text-on-surface-variant text-[12px] mt-2 font-medium opacity-70">
                  Upload your handwritten entries for advanced multi-lingual digital synthesis.
                </p>
              </div>
              
              {/* Project Selection Tabs */}
              <div className="flex bg-surface-container-low p-1 rounded-xl border border-border/50 self-center md:self-end">
                <button 
                  onClick={() => setIsNewProject(true)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isNewProject ? 'bg-primary text-primary-foreground shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  Create New Note
                </button>
                <button 
                  onClick={() => setIsNewProject(false)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isNewProject ? 'bg-primary text-primary-foreground shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  Add to Existing Note
                </button>
              </div>
            </div>

            {!isNewProject && existingBatches.length > 0 && (
              <div className="bg-surface-container-low rounded-2xl p-4 border border-primary/20 animate-scale-in">
                <label className="block text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2 px-1">Select Target Note Archive</label>
                <div className="relative">
                  <select 
                    value={selectedBatchId || ""} 
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-xs font-bold text-on-surface appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="" disabled>Choose a note from your library...</option>
                    {existingBatches.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({new Date(b.created_at).toLocaleDateString()})</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                </div>
              </div>
            )}

            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-500 p-8 md:p-14 text-center overflow-hidden group ${
                dragOver
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-outline-variant hover:border-primary/40 hover:bg-surface-container-low bg-surface-container-lowest"
              }`}
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleSelect}
              />
              <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 editorial-shadow ${
                dragOver ? "bg-primary text-surface scale-110 rotate-12" : "bg-surface-container-high text-on-surface-variant"
              }`}>
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  {dragOver ? "auto_awesome" : "cloud_upload"}
                </span>
              </div>
              <p className="font-headline font-black text-lg text-on-surface mb-1 uppercase tracking-tight">
                Drop archives here
              </p>
              <p className="text-on-surface-variant text-[11px] font-medium opacity-60 max-w-xs mx-auto">
                Securely upload your handwritten manuscripts for high-fidelity digital synthesis.
              </p>
            </div>

            {/* File List Area */}
            {files.length > 0 && (
              <div className="space-y-6 animate-scale-in">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    <h3 className="font-headline font-black text-xs text-on-surface uppercase tracking-[0.2em]">
                      Batch Queue ({files.length})
                    </h3>
                  </div>
                  <button 
                    onClick={() => setFiles([])}
                    className="text-[10px] font-black text-destructive hover:underline uppercase tracking-widest opacity-70 hover:opacity-100"
                  >
                    Purge All
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {files.map((file, i) => (
                    <div
                      key={`${file.name}-${i}`}
                      className="flex items-center gap-4 bg-surface-container-low/50 backdrop-blur-sm rounded-2xl px-5 py-4 border border-border/40 editorial-shadow hover:translate-y-[-2px] transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden border border-primary/5 grayscale group-hover:grayscale-0 transition-all">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-on-surface truncate tracking-tight uppercase">{file.name}</p>
                        <p className="text-[9px] text-outline font-black uppercase tracking-widest mt-0.5">{(file.size / 1024).toFixed(1)} KB • READY</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                        className="text-outline hover:text-destructive transition-colors p-2"
                      >
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleProcess}
                        className="w-full bg-on-surface text-surface py-6 rounded-2xl font-headline font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-primary transition-all active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <span className="material-symbols-outlined text-2xl group-hover:animate-spin-slow">rebase_edit</span>
                        Run Synthesis Pipeline ({files.length})
                    </button>
                    <p className="text-center text-[10px] text-outline font-bold mt-4 uppercase tracking-[0.1em] opacity-50">
                        High-fidelity Urdu & English Neural Transcription Powered by Llama-4
                    </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* PROCESSING MODE: Visual Feedback */
          <div className="max-w-3xl mx-auto py-12 text-center animate-scale-in">
            <div className="w-28 h-28 rounded-[2rem] bg-surface-container-low flex items-center justify-center mx-auto mb-8 relative editorial-shadow border border-border/50">
                <div className="absolute inset-0 rounded-[2rem] border-4 border-primary/10 animate-ping opacity-20 pointer-events-none" />
                <div className="absolute inset-4 rounded-[1.2rem] border-2 border-primary/20 animate-pulse pointer-events-none" />
                <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {overallProgress < 30 ? "camera_enhance" : overallProgress < 75 ? "memory" : "auto_awesome"}
                </span>
            </div>

            <div className="space-y-3 mb-10">
                <h2 className="font-headline font-black text-2xl text-on-surface uppercase tracking-tighter leading-none">
                    Digital <span className="text-outline">Synthesis</span>
                </h2>
                <div className="flex items-center justify-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.25em]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {currentStage}
                </div>
            </div>

            <div className="max-w-md mx-auto mb-16">
              <div className="relative h-4 bg-surface-container-low rounded-full border border-border/50 p-1">
                <div
                    className="h-full bg-gradient-to-r from-primary via-primary-container to-primary rounded-full transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
                    style={{ width: `${overallProgress}%` }}
                />
              </div>
              <div className="flex justify-between mt-4 px-2">
                <p className="text-[10px] font-black text-outline uppercase tracking-[0.3em]">
                  Item {currentFileIndex + 1} of {files.length}
                </p>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <p className="text-xs font-black text-primary uppercase tracking-widest">{overallProgress}%</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low/50 backdrop-blur-md rounded-2xl p-6 border border-border/30 max-w-sm mx-auto">
                <p className="text-[10px] text-on-surface-variant font-black leading-relaxed uppercase tracking-widest opacity-60">
                    Your notes are being encrypted & processed sequentially through our neural multi-lingual extraction matrix.
                </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Upload;
