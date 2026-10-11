import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMusic } from '../context/useMusic'

/**
 * AboutMusicPill - Floating audio pill for the About Me page.
 * Displays "NOW PLAYING · Shinigami" with animated equalizer bars and volume toggle,
 * or muted hint ("Music muted · tap to unmute") when entering while muted.
 */
export default function AboutMusicPill() {
  const { isPlaying, isMuted, showMutedHint, playRejected, toggleMute } = useMusic()
  const [isCollapsed, setIsCollapsed] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false))

  // Expand when hint appears or playback was blocked
  useEffect(() => {
    if (showMutedHint || playRejected) {
      setIsCollapsed(false)
    }
  }, [showMutedHint, playRejected])

  // Keyboard shortcut: 'M' key toggles mute while on About Me (ignoring input fields)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'm' || e.key === 'M') {
        const target = e.target
        const isInput =
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target?.isContentEditable
        if (!isInput) {
          e.preventDefault()
          toggleMute()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleMute])

  const isAudioActive = isPlaying && !isMuted

  return (
    <AnimatePresence>
      <motion.div
        key="about-music-pill"
        initial={{ opacity: 0, y: 20, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.9 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-[calc(84px+env(safe-area-inset-bottom,0px))] md:bottom-6 left-4 md:left-6 z-40 select-none"
      >
        {isCollapsed ? (
          /* Collapsed Round 44px Icon Button on Mobile */
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            title="Expand music player"
            aria-label="Expand music player"
            className="flex items-center justify-center w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-white/15 max-md:backdrop-blur-none max-md:bg-black/92 bg-black/85 backdrop-blur-md shadow-2xl hover:border-violet-500/40 hover:bg-black/95 transition-all text-zinc-300 hover:text-white cursor-pointer"
          >
            <span className="text-sm font-mono text-violet-400">♪</span>
          </button>
        ) : (
          /* Full Floating Pill */
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 min-h-[44px] rounded-full border border-white/15 max-md:backdrop-blur-none max-md:bg-black/92 bg-black/85 backdrop-blur-md shadow-2xl font-mono text-[11px]">
            {playRejected ? (
              /* Fallback when browser autoplay policy blocks unprompted audio */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  title="Tap to play music"
                  className="flex items-center gap-1.5 min-h-[36px] text-violet-300 hover:text-violet-100 transition-colors cursor-pointer"
                >
                  <span className="text-xs text-violet-400">▶</span>
                  <span>Tap to play music</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  aria-label="Collapse music player"
                  title="Collapse"
                  className="min-h-[44px] min-w-[32px] flex items-center justify-center text-zinc-500 hover:text-zinc-300 text-sm cursor-pointer leading-none transition-colors"
                >
                  ‹
                </button>
              </div>
            ) : showMutedHint ? (
              /* 4s hint when user enters About Me while audio is muted */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  title="Tap to unmute"
                  className="flex items-center gap-1.5 min-h-[36px] text-amber-300 hover:text-amber-100 transition-colors cursor-pointer"
                >
                  <span className="text-xs">🔇</span>
                  <span>Music muted · tap to unmute</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  aria-label="Collapse music player"
                  title="Collapse"
                  className="min-h-[44px] min-w-[32px] flex items-center justify-center text-zinc-500 hover:text-zinc-300 text-sm cursor-pointer leading-none transition-colors"
                >
                  ‹
                </button>
              </div>
            ) : (
              /* Normal Playing / Muted state */
              <>
                <button
                  type="button"
                  onClick={toggleMute}
                  title={isAudioActive ? 'Mute music (Press M)' : 'Unmute music (Press M)'}
                  className="flex items-center gap-2 min-h-[36px] text-zinc-300 hover:text-white transition-colors cursor-pointer tracking-wider"
                >
                  <span className="text-violet-400 font-bold">♪</span>
                  <span>
                    {isAudioActive ? 'NOW PLAYING · Shinigami' : 'MUTED · Shinigami'}
                  </span>

                  {/* 3 tiny violet equalizer bars: only when isPlaying && !isMuted */}
                  {isAudioActive && (
                    <div className="flex items-end gap-[2px] h-3 ml-0.5 pointer-events-none">
                      <span className="w-[2px] rounded-full bg-violet-400 animate-eq-1" />
                      <span className="w-[2px] rounded-full bg-violet-400 animate-eq-2" />
                      <span className="w-[2px] rounded-full bg-violet-400 animate-eq-3" />
                    </div>
                  )}
                </button>

                {/* Speaker icon button: only shows speaker-on when isPlaying && !isMuted */}
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isAudioActive ? 'Mute music' : 'Unmute music'}
                  title={isAudioActive ? 'Mute music' : 'Unmute music'}
                  className="min-h-[44px] min-w-[36px] flex items-center justify-center text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/10"
                >
                  {isAudioActive ? '🔊' : '🔇'}
                </button>

                {/* Collapse button */}
                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  aria-label="Collapse music player"
                  title="Collapse"
                  className="min-h-[44px] min-w-[32px] flex items-center justify-center text-zinc-500 hover:text-zinc-300 text-sm cursor-pointer leading-none transition-colors"
                >
                  ‹
                </button>
              </>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
