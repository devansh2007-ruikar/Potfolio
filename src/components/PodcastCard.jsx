import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const episodes = [
  {
    id: 1,
    title: 'Ep. 04: Building Air-Gapped Forensics for SIH 2026',
    duration: '14:20',
    tags: ['Security', 'Python', 'ML'],
    summary: 'Deep dive into isolation forests, graph taint propagation, and offline evidence dossiers.',
  },
  {
    id: 2,
    title: 'Ep. 03: DSA & LeetCode Roadmaps for CS Undergrads',
    duration: '18:45',
    tags: ['Algorithms', 'Career', 'Java'],
    summary: 'Optimal strategies for balancing college academics with consistent algorithmic problem solving.',
  },
  {
    id: 3,
    title: 'Ep. 02: Modern Spring Boot & High-Performance Java',
    duration: '12:10',
    tags: ['Backend', 'Spring Boot', 'MySQL'],
    summary: 'Architecting scalable REST services with Spring Data JPA and query optimizations.',
  },
]

export default function PodcastCard() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentEpIndex, setCurrentEpIndex] = useState(0)
  const [progress, setProgress] = useState(38) // percentage

  const currentEp = episodes[currentEpIndex]

  // Simulated progress ticking when playing
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5))
    }, 500)
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="bento-card h-full min-h-[420px] flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-violet-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              Media & Content Production
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-medium font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            2 Channels Produced
          </div>
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight">
          DevLog Podcast & Tech Broadcasts
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Technical insights, system design breakdowns & developer workflows
        </p>
      </div>

      {/* Player Glass Widget */}
      <div className="glass rounded-2xl p-4 my-3 border border-white/10 relative shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-violet-400 font-semibold uppercase">
                Now Playing
              </span>
              <div className="flex items-end gap-0.5 h-3">
                {[40, 80, 60, 100, 50, 75].map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-violet-400 rounded-full"
                    animate={{
                      height: isPlaying ? [`${h * 0.2}%`, `${h}%`, `${h * 0.3}%`] : '20%',
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8 + i * 0.1,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </div>
            <h4 className="text-sm font-semibold text-white truncate">
              {currentEp.title}
            </h4>
            <p className="text-xs text-zinc-400 truncate mt-0.5">
              {currentEp.summary}
            </p>
          </div>

          {/* Big Play / Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white flex items-center justify-center shadow-lg shadow-violet-600/30 transition-transform active:scale-95 cursor-pointer flex-shrink-0"
          >
            {isPlaying ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1.5" />
                <rect x="14" y="4" width="4" height="16" rx="1.5" />
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Scrubber slider */}
        <div className="mt-4">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="progress-track"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1.5">
            <span>
              {Math.floor((progress / 100) * 14)}:
              {String(Math.floor(((progress / 100) * 860) % 60)).padStart(2, '0')}
            </span>
            <span>{currentEp.duration}</span>
          </div>
        </div>
      </div>

      {/* Episode Playlist Selector */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
          Other Episodes
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {episodes.map((ep, idx) => (
            <button
              key={ep.id}
              onClick={() => {
                setCurrentEpIndex(idx)
                setProgress(0)
                setIsPlaying(true)
              }}
              className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                currentEpIndex === idx
                  ? 'bg-violet-600/15 border-violet-500/40 text-white'
                  : 'bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200'
              }`}
            >
              <div className="text-xs font-medium truncate">{ep.title}</div>
              <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                {ep.duration} · {ep.tags.join(', ')}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
