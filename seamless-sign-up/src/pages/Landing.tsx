import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-8 py-4">
          <div className="text-2xl font-black text-on-surface tracking-tighter font-headline">
            Curator AI
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-primary font-bold border-b-2 border-primary pb-1 font-headline tracking-tight text-sm" href="#">
              Features
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-headline tracking-tight text-sm" href="#">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-on-surface-variant hover:text-primary transition-colors font-headline font-semibold px-4 py-2 text-sm"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-br from-primary to-primary-container text-primary-foreground px-5 py-2.5 rounded-xl font-headline font-semibold text-sm active:scale-95 transition-transform editorial-shadow"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 lg:py-28">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 space-y-7">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold font-headline tracking-tighter text-on-surface leading-[1.08]">
                The Intelligent Canvas for Your{" "}
                <span className="text-primary">Handwritten</span> Thoughts
              </h1>
              <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
                Transform messy scribbles into structured digital insights.
                Powered by Llama-4 Scout Vision and Mixtral-8x7B for unmatched semantic
                accuracy.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/signup"
                  className="bg-gradient-to-br from-primary to-primary-container text-primary-foreground px-7 py-3.5 rounded-xl font-headline font-bold text-base editorial-shadow active:scale-95 transition-transform"
                >
                  Get Started for Free
                </Link>
                <button className="bg-surface-container-high text-on-surface px-7 py-3.5 rounded-xl font-headline font-bold text-base hover:bg-surface-container-highest transition-colors">
                  How it Works
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden editorial-shadow border border-outline-variant/30">
                <img
                  className="w-full h-auto object-cover"
                  alt="Split screen showing handwritten notes transformed into digital insights"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHNJMomRtQcD8VpTurDSLPjAsifj1G5pLz9mQGENg0cXhTh8r_LuHe0pCd4tGPXQqAza4gCYA8FrmiJld-tHQ8RAOTgkiP9p541_dv7MsMUgFRG3VG1b_ol2rbEgFZRFyC5D5bcRxCAozXcUNBuT68IqazreAqJDnc_ZND5xtYNfJUvQWXoVvg3j12x33sJn-A21NuNuEZBlXPj79BgKnGDjDBmkVe7xd_6NuqRJYGh5fVaOd3fua1mtOwcyuK69k4o1HABv531Eg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-tertiary/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-surface-container-low py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="mb-14 text-center lg:text-left">
              <span className="text-primary font-headline font-bold tracking-widest text-xs uppercase">
                Capabilities
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold font-headline tracking-tight mt-2">
                Beyond Simple Recognition
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Feature 1 */}
              <div className="bg-surface-container-lowest p-7 rounded-xl editorial-shadow flex flex-col items-start gap-5 hover:translate-y-[-2px] transition-transform">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-primary text-2xl"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    edit_note
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-headline mb-2">
                    Precision OCR
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    Utilizing Llama-4 Scout Vision to achieve high-fidelity text extraction
                    from any handwriting style, from cursive to block lettering.
                  </p>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="bg-surface-container-lowest p-7 rounded-xl editorial-shadow flex flex-col items-start gap-5 hover:translate-y-[-2px] transition-transform">
                <div className="w-11 h-11 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-tertiary text-2xl"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    auto_awesome
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-headline mb-2">
                    AI Refinement
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    Mixtral-8x7B intelligently fixes grammar, spelling, and adds
                    semantic structure to your raw digitized notes.
                  </p>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="bg-surface-container-lowest p-7 rounded-xl editorial-shadow flex flex-col items-start gap-5 hover:translate-y-[-2px] transition-transform">
                <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-secondary text-2xl"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    inventory_2
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-headline mb-2">
                    Digital Archive
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    A permanent, searchable cloud sanctuary for your physical
                    knowledge. Find any thought in seconds with global search.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pipeline Section */}
        <section className="py-20 lg:py-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Pipeline visual */}
              <div className="order-2 lg:order-1">
                <div className="relative bg-surface-container rounded-2xl p-1">
                  <div className="bg-surface-container-lowest rounded-xl p-6 lg:p-8 space-y-5">
                    {/* Step 1 */}
                    <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-lg">
                      <span className="w-7 h-7 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                        1
                      </span>
                      <span className="font-headline font-bold text-sm">
                        Image Input
                      </span>
                      <span className="material-symbols-outlined ml-auto text-outline text-xl">
                        image
                      </span>
                    </div>
                    <div className="flex items-center justify-center py-1">
                      <span className="material-symbols-outlined text-primary-container text-xl">
                        arrow_downward
                      </span>
                    </div>
                    {/* Step 2 */}
                    <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-lg border border-primary/10">
                      <span className="w-7 h-7 rounded bg-primary-container text-primary-foreground flex items-center justify-center font-bold text-xs">
                        2
                      </span>
                      <span className="font-headline font-bold text-sm">
                        Llama-4 Scout Vision Processing
                      </span>
                      <div className="ml-auto flex items-center gap-1">
                        <div className="w-1 h-4 bg-primary rounded-full animate-pulse" />
                        <div className="w-1 h-6 bg-primary rounded-full" />
                        <div className="w-1 h-3 bg-primary rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center py-1">
                      <span className="material-symbols-outlined text-tertiary text-xl">
                        arrow_downward
                      </span>
                    </div>
                    {/* Step 3 */}
                    <div className="flex items-center gap-4 bg-tertiary/5 p-4 rounded-lg border border-tertiary/10">
                      <span className="w-7 h-7 rounded bg-tertiary text-primary-foreground flex items-center justify-center font-bold text-xs">
                        3
                      </span>
                      <span className="font-headline font-bold text-sm">
                        Mixtral-8x7B LLM Refinement
                      </span>
                      <span className="material-symbols-outlined ml-auto text-tertiary text-xl">
                        psychology
                      </span>
                    </div>
                    <div className="flex items-center justify-center py-1">
                      <span className="material-symbols-outlined text-emerald-600 text-xl">
                        check_circle
                      </span>
                    </div>
                    {/* Step 4 */}
                    <div className="flex items-center gap-4 bg-surface-container-highest p-4 rounded-lg">
                      <span className="w-7 h-7 rounded bg-emerald-600 text-primary-foreground flex items-center justify-center font-bold text-xs">
                        4
                      </span>
                      <span className="font-headline font-bold text-sm">
                        Structured Markdown Output
                      </span>
                      <span className="material-symbols-outlined ml-auto text-on-surface-variant text-xl">
                        description
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Text content */}
              <div className="order-1 lg:order-2 space-y-7">
                <h2 className="text-3xl lg:text-5xl font-extrabold font-headline tracking-tight text-on-surface">
                  The Intelligence Behind the Canvas
                </h2>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Our proprietary pipeline doesn't just read words—it understands
                  context. By combining industry-leading OCR with fine-tuned Large
                  Language Models, we bridge the gap between ink and digital logic.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">
                      done
                    </span>
                    <span className="font-medium text-sm">
                      Context-aware auto-formatting
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">
                      done
                    </span>
                    <span className="font-medium text-sm">
                      Multi-language handwriting support
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">
                      done
                    </span>
                    <span className="font-medium text-sm">
                      Privacy-focused local-first processing
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Live Demo / Archival Section */}
        <section className="max-w-5xl mx-auto px-6 md:px-8 mb-20 lg:mb-28">
          <div className="bg-surface-container-low rounded-2xl p-8 lg:p-16 relative overflow-hidden">
            <div className="relative z-10 grid lg:grid-cols-5 gap-10">
              <div className="lg:col-span-2 space-y-5">
                <span className="px-3 py-1 rounded-full bg-tertiary text-primary-foreground text-[10px] font-bold tracking-widest uppercase inline-block">
                  Live Demo
                </span>
                <h3 className="text-2xl lg:text-3xl font-extrabold font-headline tracking-tight">
                  The Archival Standard
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Experience note-taking that feels like a sun-lit studio. No
                  clutter, just your ideas refined by intelligence.
                </p>
              </div>
              <div className="lg:col-span-3">
                <div className="bg-surface-container-lowest editorial-shadow rounded-xl p-6 lg:p-8 min-h-[260px]">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold font-headline text-on-surface">
                        Product Strategy Meeting
                      </h4>
                      <span className="text-[10px] font-medium text-outline uppercase tracking-widest font-label">
                        OCT 24, 2024
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] font-label">
                      Summarizing...
                    </span>
                  </div>
                  <div className="space-y-3 text-on-surface-variant leading-relaxed text-sm">
                    <p className="text-on-surface font-semibold">
                      Key Decisions:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Pivot toward{" "}
                        <span className="bg-primary/10 text-primary px-1 rounded">
                          editorial-first
                        </span>{" "}
                        UI for Q4.
                      </li>
                      <li>
                        Integrate Mixtral-8x7B for on-device processing.
                      </li>
                      <li>
                        Launch mobile beta for iOS and Android by December.
                      </li>
                    </ul>
                    <p className="mt-3 italic text-xs text-outline">
                      Notes transcribed from napkin sketch during coffee meeting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl -z-0" />
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 lg:py-24">
          <div className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-10 lg:p-20 text-center space-y-8 editorial-shadow">
            <h2 className="text-3xl lg:text-5xl xl:text-6xl font-extrabold font-headline tracking-tighter text-primary-foreground">
              Ready to digitize your knowledge?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto font-medium">
              Join thousands of researchers, students, and creative professionals
              who have upgraded their physical workflow.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <Link
                to="/signup"
                className="bg-surface-container-lowest text-primary px-8 py-4 rounded-xl font-headline font-bold text-lg hover:bg-white transition-colors active:scale-95"
              >
                Create Account
              </Link>
              <button className="bg-white/10 border border-white/20 text-primary-foreground px-8 py-4 rounded-xl font-headline font-bold text-lg hover:bg-white/20 transition-colors backdrop-blur-md">
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low w-full py-10 px-6 md:px-8 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 max-w-7xl mx-auto">
          <div className="space-y-1.5">
            <div className="text-lg font-bold text-on-surface font-headline">
              Curator AI
            </div>
            <p className="text-outline text-xs font-medium">
              © 2024 Curator AI. The Intelligent Canvas.
            </p>
          </div>
          <div className="flex gap-6">
            <a className="text-outline hover:text-primary transition-colors text-xs font-medium" href="#">
              Privacy Policy
            </a>
            <a className="text-outline hover:text-primary transition-colors text-xs font-medium" href="#">
              Terms of Service
            </a>
            <a className="text-outline hover:text-primary transition-colors text-xs font-medium" href="#">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
