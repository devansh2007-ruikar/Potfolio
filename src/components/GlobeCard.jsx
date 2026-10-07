import { useState, useEffect } from 'react'

export default function GlobeCard() {
  const [time, setTime] = useState('')

  useEffect(() => {
    function updateClock() {
      const now = new Date()
      // Display in India Standard Time
      const istString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      setTime(istString)
    }

    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bento-card h-full min-h-[420px] lg:min-h-0 flex flex-col justify-between p-6 lg:p-4 [@media(max-height:760px)]:p-3.5 relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500 glow-blue" />

      {/* Header */}
      <div className="z-10">
        <div className="flex items-center justify-between mb-2 lg:mb-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              Location & Time
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            UTC +5:30
          </span>
        </div>
        <h3 className="text-xl lg:text-lg [@media(max-height:760px)]:text-base font-bold text-white tracking-tight">Nagpur, India</h3>
        <p className="text-xs text-zinc-400 font-mono">21.1458° N, 79.0882° E</p>
      </div>

      {/* Center 3D Wireframe Animated Globe Visual */}
      <div className="relative my-4 lg:my-1.5 [@media(max-height:760px)]:my-1 flex items-center justify-center z-10">
        <div className="relative w-40 h-40 lg:w-28 lg:h-28 xl:w-32 xl:h-32 [@media(max-height:760px)]:w-22 [@media(max-height:760px)]:h-22 flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-pulse" />
          <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/30 globe-rotate" />

          {/* Spherical Wireframe SVG */}
          <svg
            className="w-32 h-32 lg:w-22 lg:h-22 xl:w-26 xl:h-26 [@media(max-height:760px)]:w-18 [@media(max-height:760px)]:h-18 text-cyan-400/40 globe-rotate"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
          >
            <circle cx="50" cy="50" r="46" />
            <ellipse cx="50" cy="50" rx="46" ry="20" />
            <ellipse cx="50" cy="50" rx="20" ry="46" />
            <ellipse cx="50" cy="50" rx="35" ry="46" />
            <line x1="4" y1="50" x2="96" y2="50" />
            <line x1="50" y1="4" x2="50" y2="96" />
          </svg>

          {/* Nagpur Location Ping Pin */}
          <div className="absolute top-[38%] left-[56%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Live Time & Availability */}
      <div className="z-10 bg-white/[0.03] border border-white/[0.07] rounded-xl p-3 lg:p-2 [@media(max-height:760px)]:p-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-zinc-400 font-medium">Local Time (IST)</span>
          <span className="text-xs font-mono font-semibold text-white tracking-wider">
            {time || '14:00:00 IST'}
          </span>
        </div>
        <div className="mt-2 lg:mt-1 pt-2 lg:pt-1 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-400">
          <span>Work Mode</span>
          <span className="text-emerald-400 font-medium">Remote & Hybrid</span>
        </div>
      </div>
    </div>
  )
}
