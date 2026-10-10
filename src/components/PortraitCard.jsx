export default function PortraitCard() {
  return (
    <div className="bento-card h-full min-h-[420px] lg:min-h-0 flex flex-col justify-between p-6 lg:p-4 [@media(max-height:760px)]:p-3.5 relative overflow-hidden group">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -left-24 w-56 h-56 bg-violet-600/20 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-600/30 transition-all duration-500" />
      <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Availability Badge */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-medium text-emerald-400 tracking-wide">
            Open for Internships
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
          Nagpur, IN
        </span>
      </div>

      {/* Center: Image Frame */}
      <div className="relative my-4 lg:my-2 [@media(max-height:760px)]:my-1 flex justify-center items-center z-10">
        <div className="relative">
          <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-fuchsia-500 opacity-30 blur-sm group-hover:opacity-60 transition duration-500" />
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 lg:w-28 lg:h-28 xl:w-32 xl:h-32 [@media(max-height:760px)]:w-22 [@media(max-height:760px)]:h-22 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/80 shadow-2xl">
            <img
              src="/me.jpg"
              alt="Devansh Ruikar"
              width="600"
              height="600"
              fetchPriority="high"
              className="w-full h-full object-cover object-[50%_25%] group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Bottom: Info & Details */}
      <div className="z-10 space-y-2 lg:space-y-1.5 [@media(max-height:760px)]:space-y-1">
        <div>
          <h2 className="text-xl lg:text-lg [@media(max-height:760px)]:text-base font-bold text-white tracking-tight flex items-center gap-2">
            Devansh Ruikar
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 font-normal">
              He/Him
            </span>
          </h2>
          <p className="text-xs text-zinc-400 font-medium mt-0.5">
            Software Developer · Java · React · Spring Boot
          </p>
        </div>

        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
          B.Tech CSE @ Ramdeobaba University. Passionate about DSA, distributed systems & AI-assisted web apps.
        </p>

        {/* Action / Social links */}
        <div className="pt-2 lg:pt-1.5 [@media(max-height:760px)]:pt-1 flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-1.5 text-center text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-1.5 text-center text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:devanshruikar2007@gmail.com"
            className="px-3 py-1.5 text-center text-xs font-medium rounded-lg bg-violet-600/80 hover:bg-violet-600 text-white transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  )
}
