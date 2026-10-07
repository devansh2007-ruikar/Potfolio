
export default function HeroRoleCard() {
  return (
    <div className="bento-card h-full min-h-[420px] flex flex-col justify-between p-6 relative overflow-hidden group">
      {/* Background cyber grid & glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              Flagship Project
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            SIH 2026
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
          MITHYA
          <span className="text-xs font-mono font-normal text-zinc-500">v1.0</span>
        </h3>
        <p className="text-xs text-amber-200/80 font-mono mt-0.5">
          Crypto-Forensics & Triage Engine
        </p>

        <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
          Air-gapped transaction forensics engine that clusters wallet entities and traces multi-hop fund flows with graph taint propagation.
        </p>
      </div>

      {/* Live Engine Metrics */}
      <div className="my-3 grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <div className="text-[10px] uppercase font-mono text-zinc-500">Throughput</div>
          <div className="text-base font-bold text-white font-mono mt-0.5 flex items-baseline gap-1">
            ~1,500
            <span className="text-[10px] text-zinc-400 font-normal">tx/s</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <div className="text-[10px] uppercase font-mono text-zinc-500">Test Suite</div>
          <div className="text-base font-bold text-emerald-400 font-mono mt-0.5 flex items-baseline gap-1">
            87/87
            <span className="text-[10px] text-zinc-400 font-normal">passed</span>
          </div>
        </div>
      </div>

      {/* Bottom Stack Chips */}
      <div>
        <div className="flex flex-wrap gap-1 mb-3">
          {['Python', 'Scikit-Learn', 'NetworkX', 'Isolation Forest', 'Streamlit'].map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-zinc-400 border border-white/[0.06]"
            >
              {tech}
            </span>
          ))}
        </div>

        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="w-full py-2 flex items-center justify-center gap-1.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-medium text-white transition-colors cursor-pointer"
        >
          <span>Explore Architecture</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  )
}
