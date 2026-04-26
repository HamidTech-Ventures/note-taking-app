import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/AppLayout";
import { batchesApi } from "@/lib/api";
import { 
  Search, 
  Plus, 
  FolderHeart, 
  ChevronRight, 
  Loader2, 
  History as HistoryIcon,
  Filter,
  Calendar,
  FileStack
} from "lucide-react";

/**
 * PROJECT-BASED HISTORY
 * Instead of individual notes, we now show 'Batches' (Projects).
 * This provides a much cleaner overview and allows 'Continuing' research.
 */
const History = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  const { data: batches, isLoading } = useQuery({
    queryKey: ["batches"],
    queryFn: () => batchesApi.getList(),
  });

  const filtered = batches?.filter((batch: any) => 
    (batch.name || "Untitled Project").toLowerCase().includes(search.toLowerCase()) ||
    (batch.combined_text || "").toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <AppLayout>
      <div className="p-6 md:p-8 lg:p-10 max-w-5xl mx-auto space-y-8 animate-fade-in font-body">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/5">
                <HistoryIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
                <h1 className="text-2xl md:text-3xl font-black font-headline tracking-tighter text-on-surface uppercase leading-none">
                Neural <span className="text-outline">Archives</span>
                </h1>
                <p className="text-on-surface-variant text-[11px] mt-2 font-bold opacity-70 uppercase tracking-widest">
                Curated historical log of crystallized intelligence.
                </p>
            </div>
          </div>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-primary-foreground px-6 py-3.5 rounded-xl font-headline font-bold text-[10px] uppercase tracking-[0.2em] editorial-shadow active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Create New Note
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4 transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="Search projects, topics, or synthesized content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-surface-container-lowest border border-border/50 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-medium editorial-shadow"
            />
          </div>
          <button className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-surface-container-low border border-border/50 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-high transition-all">
            <Filter className="w-4 h-4" />
            Vault Filters
          </button>
        </div>

        {/* Results Info */}
        {!isLoading && (
            <div className="flex items-center gap-2">
                <p className="text-[10px] font-black text-outline uppercase tracking-[0.2em]">
                {filtered.length} Crystalized {filtered.length === 1 ? "Note" : "Notes"}
                </p>
                <div className="h-px flex-1 bg-surface-container-high" />
            </div>
        )}

        {/* Project List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center opacity-40">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Decoding Archives...</p>
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((batch: any, i: number) => (
              <div
                key={batch.id}
                className="group relative bg-surface-container-lowest rounded-3xl p-6 border border-border/50 editorial-shadow hover:translate-y-[-2px] hover:border-primary/30 transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col md:flex-row gap-6 relative">
                  {/* Left: Metadata & Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors border border-border/50">
                    <FolderHeart className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>

                  {/* Center: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-black text-on-surface truncate group-hover:text-primary transition-colors tracking-tight uppercase leading-none">
                        {batch.name || "Untitled Note Archive"}
                      </h3>
                      {batch.pdf_url && (
                        <div className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                          PDF READY
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-outline uppercase tracking-[0.15em]">
                          <Calendar className="w-3 h-3" />
                          {new Date(batch.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-outline uppercase tracking-[0.15em]">
                          <FileStack className="w-3.5 h-3.5" />
                          {batch.notes?.length || 0} Entries Digitized
                      </div>
                    </div>

                    <p className="text-[11px] text-on-surface-variant font-medium mt-4 line-clamp-2 opacity-60 leading-relaxed italic">
                      {batch.combined_text || "Awaiting digital crystallization..."}
                    </p>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-row md:flex-col items-center justify-end gap-3 self-end md:self-center">
                    <button 
                      onClick={() => navigate(`/upload?batch_id=${batch.id}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-low hover:bg-primary hover:text-primary-foreground border border-border/50 transition-all text-[9px] font-black uppercase tracking-widest"
                    >
                      Continue Adding
                    </button>
                    <Link
                      to={`/projects/${batch.id}`}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-on-surface text-surface hover:bg-primary transition-all text-[9px] font-black uppercase tracking-[0.2em] editorial-shadow"
                    >
                      View Full Note
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 animate-fade-in bg-surface-container-low/30 rounded-[3rem] border-2 border-dashed border-border/40">
              <FolderHeart className="w-14 h-14 text-outline/20 mx-auto mb-6" />
              <h3 className="font-headline font-black text-lg text-on-surface uppercase tracking-widest">Neural Vault Empty</h3>
              <p className="text-[10px] text-on-surface-variant mt-2 font-bold uppercase tracking-[0.1em] opacity-50 px-10">No projects found. Begin your first digitized collection today.</p>
              <Link to="/upload" className="inline-block mt-8 text-[10px] font-black text-primary hover:underline uppercase tracking-widest border border-primary/20 px-6 py-3 rounded-2xl hover:bg-primary/5 transition-all">
                Initiate First Synthesis
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default History;
