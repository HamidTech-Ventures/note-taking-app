import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/AppLayout";
import { notesApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { 
  FileText, 
  Clock, 
  Search, 
  Folder, 
  Plus, 
  CheckCircle2, 
  ChevronRight, 
  Loader2, 
  Rocket, 
  Cpu
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: () => notesApi.getList(),
  });

  const recentScans = notes?.slice(0, 5) || [];
  
  // Dynamic stats calculation
  const stats = [
    { 
      label: "Total Scans", 
      value: notes?.length || 0, 
      icon: <FileText className="w-5 h-5" />, 
      color: "bg-primary/10 text-primary", 
      trend: "All-time history" 
    },
    { 
      label: "Accuracy", 
      value: notes?.length ? "97%" : "0%", 
      icon: <CheckCircle2 className="w-5 h-5" />, 
      color: "bg-emerald-100 text-emerald-600", 
      trend: "Neural extraction" 
    },
    { 
      label: "Time Saved", 
      value: notes?.length ? `${notes.length * 15}m` : "0m", 
      icon: <Clock className="w-5 h-5" />, 
      color: "bg-orange-100 text-orange-600", 
      trend: "vs manual typing" 
    },
    { 
      label: "Storage", 
      value: notes?.length ? `${(notes.length * 0.5).toFixed(1)}MB` : "0MB", 
      icon: <Folder className="w-5 h-5" />, 
      color: "bg-blue-100 text-blue-600", 
      trend: "Cloudinary sync" 
    },
  ];

  return (
    <AppLayout>
      <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in font-body">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black font-headline tracking-tighter text-on-surface uppercase">
              Welcome back, {user?.name?.split(" ")[0] || "Scholar"} 👋
            </h1>
            <p className="text-on-surface-variant text-sm mt-1 font-medium opacity-70">
              Your neural workspace is synchronized and ready for new entries.
            </p>
          </div>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-primary-foreground px-6 py-3 rounded-xl font-headline font-bold text-xs uppercase tracking-widest editorial-shadow active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            New Synthesis
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="bg-surface-container-lowest rounded-2xl p-6 editorial-shadow border border-border/50 hover:translate-y-[-2px] transition-all duration-300 group"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover:scale-110 duration-300 ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-black font-headline tracking-tighter text-on-surface">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-outline" /> : stat.value}
              </p>
              <p className="text-[10px] font-black text-outline mt-2 uppercase tracking-[0.15em]">{stat.label}</p>
              <p className="text-[9px] text-primary mt-1 font-bold uppercase tracking-widest">{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Recent Scans & Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Scans */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl editorial-shadow border border-border/50 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-surface-container-low/30">
              <h2 className="font-headline font-black text-xs text-on-surface uppercase tracking-widest">Recent Activity</h2>
              <Link to="/history" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Archives <span>→</span>
              </Link>
            </div>
            
            <div className="divide-y divide-border overflow-y-auto">
              {isLoading ? (
                <div className="p-20 flex flex-col items-center justify-center opacity-40">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest">Accessing records...</p>
                </div>
              ) : recentScans.length > 0 ? (
                recentScans.map((scan: any) => (
                  <Link
                    key={scan.id}
                    to={`/results/${scan.id}`}
                    className="flex items-center gap-4 px-6 py-5 hover:bg-surface-container-low transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors border border-primary/5">
                      <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors tracking-tight">
                        {scan.title || "Untitled Synthesis"}
                      </p>
                      <p className="text-[10px] text-outline font-bold uppercase tracking-widest mt-0.5">
                        {new Date(scan.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 mr-2">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                            {scan.accuracy || "97%"}
                        </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-colors group-hover:translate-x-1 duration-300" />
                  </Link>
                ))
              ) : (
                <div className="py-20 text-center px-6">
                    <Search className="w-12 h-12 text-outline/30 mx-auto mb-4" />
                    <p className="text-sm font-bold text-on-surface opacity-50 uppercase tracking-tighter italic">No transmissions found yet</p>
                    <Link to="/upload" className="text-xs text-primary font-black uppercase tracking-widest mt-2 block hover:underline">Start your first scan</Link>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Quick Action Card */}
            <div className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-8 editorial-shadow text-primary-foreground relative overflow-hidden group">
              <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <Rocket className="text-primary-foreground w-8 h-8 mb-4 relative" />
              <h3 className="font-headline font-black text-xl mb-2 relative uppercase tracking-widest">Rapid Digitization</h3>
              <p className="text-primary-foreground/70 text-[11px] font-medium leading-relaxed mb-6 block relative uppercase tracking-tighter">
                Accelerate your workflow. Process multiple files sequentially with our optimized neural pipeline.
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-all border border-white/20 relative"
              >
                Launch Protocol
              </Link>
            </div>

            {/* Pipeline Status */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 editorial-shadow border border-border/50">
              <h3 className="font-headline font-black text-[10px] mb-5 text-outline uppercase tracking-[0.2em] border-b border-border pb-3">Systems Operational</h3>
              <div className="space-y-4">
                {[
                  { name: "Llama-4 Scout Vision", icon: <Cpu className="w-3.5 h-3.5" /> },
                  { name: "Mixtral-8x7B LLM", icon: <Cpu className="w-3.5 h-3.5" /> },
                  { name: "Cloudinary Gateway", icon: <Cpu className="w-3.5 h-3.5" /> }
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-3 group">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:animate-pulse transition-all shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <div className="flex items-center gap-2">
                        <span className="text-outline/50">{item.icon}</span>
                        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
