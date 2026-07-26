import { Link } from "react-router-dom";

const features = [
  {
    icon: (
      <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "ATS Compatibility Scoring",
    description: "Get an instant, transparent score breakdown calculated against 70+ industry skill taxonomy benchmarks."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant Job Matcher",
    description: "Paste target job descriptions to analyze real-time skill overlap and discover missing keywords before applying."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI Career Recommendations",
    description: "Receive tailored role suitability scores and actionable bullet-point advice to optimize your resume."
  }
];

const steps = [
  { num: "01", label: "Upload PDF", detail: "Drop in your resume in standard PDF format for analysis." },
  { num: "02", label: "Parse & Extract", detail: "Our engine extracts technical skills, sections, and quantified metrics." },
  { num: "03", label: "ATS Evaluation", detail: "View transparent section presence, skill density, and format ratings." },
  { num: "04", label: "Bridge the Gap", detail: "Get targeted recommendations and job description matching." },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
              <span className="text-xs font-semibold text-indigo-300 tracking-wide uppercase">
                AI Resume Intelligence Platform
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Stop guessing why your resume gets <span className="text-gradient">skipped by ATS.</span>
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
              Scanline analyzes your resume like top applicant tracking systems do. Uncover missing skills, score your formatting, and compare directly against target job descriptions.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/upload"
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>Analyze Your Resume Free</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-md">
              <div>
                <div className="font-mono text-2xl font-bold text-indigo-400">70+</div>
                <div className="text-xs text-slate-400 font-medium">Skill Taxonomy</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-purple-400">100%</div>
                <div className="text-xs text-slate-400 font-medium">Free & Private</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-pink-400">&lt; 3s</div>
                <div className="text-xs text-slate-400 font-medium">Instant Analysis</div>
              </div>
            </div>
          </div>

          {/* Interactive Terminal Mockup */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800/80">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-slate-400">scanline-cli ~ v2.0</span>
              </div>

              <div className="font-mono text-xs sm:text-sm space-y-2.5 text-slate-300">
                <p className="text-slate-500">$ scanline analyze Senior_Engineer_Resume.pdf</p>
                <p className="text-indigo-400">&gt; Parsing PDF text layer... [100%]</p>
                <p className="text-purple-400">&gt; Evaluating section presence &amp; format...</p>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/90 my-2 space-y-1">
                  <div className="flex justify-between text-slate-200 font-bold">
                    <span>ATS COMPATIBILITY SCORE</span>
                    <span className="text-emerald-400 font-mono">85 / 100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full w-[85%]" />
                  </div>
                </div>
                <p className="text-emerald-400">&gt; Found: React, Node.js, Express, MongoDB, Git</p>
                <p className="text-amber-400">&gt; Missing for Target Role: Docker, AWS, TypeScript</p>
                <p className="text-pink-400">&gt; AI Suggestion: Add metric impact on 2 bullet points</p>
              </div>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-glow" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 max-w-6xl mx-auto px-6 border-t border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-3xl font-bold text-white">
            Built for modern job seekers &amp; engineers
          </h2>
          <p className="mt-3 text-slate-400">
            Everything you need to optimize your resume and match job descriptions seamlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass-panel-hover p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-5">
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Step-by-Step Workflow */}
      <section className="py-16 max-w-6xl mx-auto px-6 mb-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-3xl font-bold text-white">How Scanline Works</h2>
          <p className="mt-3 text-slate-400">Simple 4-step workflow to unlock your resume potential</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="glass-panel p-6 rounded-2xl relative">
              <span className="font-mono text-3xl font-extrabold text-indigo-500/40 block mb-3">{s.num}</span>
              <h4 className="font-display font-bold text-lg text-white mb-2">{s.label}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{s.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
