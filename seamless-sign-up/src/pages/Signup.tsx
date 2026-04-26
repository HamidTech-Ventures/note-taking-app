import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await signup({ full_name: fullName, email, password });
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-3 md:p-6 bg-surface relative overflow-hidden font-body">
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-tertiary/5 blur-[100px]" />
      </div>

      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 bg-surface-container-lowest rounded-2xl md:rounded-[2rem] shadow-sm max-h-[100vh] md:max-h-[92vh] overflow-hidden border border-border/50">
        {/* Left: Branding - hidden on mobile */}
        <section className="hidden md:flex md:col-span-5 relative p-6 lg:p-10 flex-col justify-between overflow-hidden bg-surface-container-low border-r border-border/50">
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-gradient-to-br from-primary/20 via-transparent to-tertiary/10" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 bg-primary-container rounded-xl flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-primary-foreground text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
              </div>
              <span className="font-headline font-extrabold text-xl tracking-tighter text-on-surface uppercase">
                Curator AI
              </span>
            </div>

            <h1 className="font-headline font-black text-3xl lg:text-4xl text-on-surface leading-[1.1] mb-4">
              Step into<br />your <span className="text-primary">Studio.</span>
            </h1>
            <p className="text-on-surface-variant text-sm lg:text-base max-w-sm font-light leading-relaxed">
              Experience an intelligent canvas that curates your thoughts, organizes your library, and elevates your workflow.
            </p>
          </div>

          <div className="relative z-10 mt-6 animate-fade-in">
            <div className="p-4 glass-panel rounded-2xl editorial-shadow max-w-xs border border-white/20">
              <p className="italic text-on-surface-variant text-xs mb-3 font-medium opacity-80">
                "The AI digitization is incredibly fast. My handwritten notes are ready in seconds."
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border border-primary/20">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-on-surface">Elena Vance</p>
                  <p className="text-[9px] text-outline font-bold uppercase tracking-wider">Early Adopter</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Registration Form */}
        <section className="md:col-span-7 p-6 md:p-8 lg:p-12 bg-surface-container-lowest overflow-y-auto">
          <div className="max-w-md mx-auto">
            {/* Mobile brand header */}
            <div className="flex items-center gap-2 mb-6 md:hidden">
              <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-foreground text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
              </div>
              <span className="font-headline font-extrabold text-lg tracking-tighter text-on-surface">Curator AI</span>
            </div>

            <header className="mb-8">
              <h2 className="font-headline font-bold text-2xl text-on-surface mb-1">Create Account</h2>
              <p className="text-on-surface-variant text-sm font-medium">Join the next generation of knowledge management.</p>
            </header>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-outline ml-1" htmlFor="name">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-transparent hover:border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none text-on-surface placeholder:text-outline/40 font-medium text-sm"
                    id="name"
                    placeholder="John Doe"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-outline ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-transparent hover:border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none text-on-surface placeholder:text-outline/40 font-medium text-sm"
                    id="email"
                    placeholder="hello@curator.ai"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-outline ml-1" htmlFor="password">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      className="w-full pl-10 pr-3 py-3 bg-surface-container-low border border-transparent hover:border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none text-on-surface placeholder:text-outline/40 font-medium text-sm"
                      id="password"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-outline ml-1" htmlFor="confirm-password">
                    Confirm
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <input
                      className="w-full pl-10 pr-3 py-3 bg-surface-container-low border border-transparent hover:border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none text-on-surface placeholder:text-outline/40 font-medium text-sm"
                      id="confirm-password"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-br from-primary to-primary-container text-primary-foreground font-headline font-bold py-4 rounded-xl editorial-shadow hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group text-xs uppercase tracking-widest disabled:opacity-70 disabled:scale-100"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Workspace...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <footer className="mt-8 text-center pt-8 border-t border-surface-container-high">
              <p className="text-on-surface-variant text-xs font-medium">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-black hover:underline decoration-2 underline-offset-4 ml-1 tracking-tight">
                  Log in here
                </Link>
              </p>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Signup;
