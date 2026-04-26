import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden font-body">
      <main className="flex-grow flex items-center justify-center p-4 relative">
        {/* Background decorations */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-tertiary/5 blur-[100px]" />

        <div className="w-full max-w-sm z-10 animate-fade-in">
          {/* Brand */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-highest mb-3 editorial-shadow">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </div>
            <h1 className="font-headline font-black text-2xl tracking-tighter text-on-surface mb-1 uppercase">Curator AI</h1>
            <p className="font-body text-on-surface-variant text-xs tracking-tight font-medium opacity-70">Your Intelligent Editorial Canvas</p>
          </div>

          {/* Login Card */}
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl ambient-shadow border border-border/50">
            <div className="mb-6">
              <h2 className="font-headline font-bold text-xl text-on-surface mb-0.5">Welcome back</h2>
              <p className="text-xs text-on-surface-variant font-medium">Please enter your details to sign in</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-1.5">
                <label className="font-label text-[10px] font-bold uppercase tracking-[0.15em] text-outline px-1" htmlFor="login-email">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline transition-colors group-focus-within:text-primary" />
                  <input
                    className="w-full bg-surface-container-low border border-transparent hover:border-outline-variant rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest text-on-surface placeholder:text-outline/40 transition-all outline-none text-sm font-medium"
                    id="login-email"
                    placeholder="alex@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end px-1">
                  <label className="font-label text-[10px] font-bold uppercase tracking-[0.15em] text-outline" htmlFor="login-password">
                    Password
                  </label>
                  <a className="text-[10px] font-bold text-primary hover:underline transition-all cursor-pointer tracking-tight">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline transition-colors group-focus-within:text-primary" />
                  <input
                    className="w-full bg-surface-container-low border border-transparent hover:border-outline-variant rounded-xl py-3 pl-10 pr-10 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest text-on-surface placeholder:text-outline/40 transition-all outline-none text-sm font-medium"
                    id="login-password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-primary-foreground font-headline font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Login to Workspace"
                )}
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-surface-container-high">
              <p className="text-xs text-on-surface-variant font-medium">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary font-black hover:underline tracking-tight">
                  Create an account
                </Link>
              </p>
          </div>
        </div>
      </div>

        {/* Footer */}
        <div className="mt-6 flex justify-center space-x-5">
          <a className="text-[9px] uppercase tracking-widest text-outline font-bold hover:text-primary transition-colors cursor-pointer">Privacy Policy</a>
          <a className="text-[9px] uppercase tracking-widest text-outline font-bold hover:text-primary transition-colors cursor-pointer">Terms of Service</a>
          <a className="text-[9px] uppercase tracking-widest text-outline font-bold hover:text-primary transition-colors cursor-pointer">Help Center</a>
        </div>
      </main>
    </div>
  );
};

export default Login;
