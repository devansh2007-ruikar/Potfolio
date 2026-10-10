import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMusic } from '../context/useMusic'

/**
 * AboutMusicPill - Floating audio pill for the About Me page.
 * Displays "♪ NOW PLAYING · Shinigami" with animated equalizer bars,
 * 🔊/🔇 mute toggle, collapse button, and keyboard shortcut 'M'.
 */
export default function AboutMusicPill() {
  const { isPlaying, isMuted, playRejected, toggleMute, unmuteAndPlay } = useMusic()
  const [isCollapsed, setIsCollapsed] = useState(false)

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

  return (
    <AnimatePresence>
      <motion.div
        key="about-music-pill"
        initial={{ opacity: 0, y: 20, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.9 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-6 left-6 z-40 select-none"
      >
        {isCollapsed ? (
          /* Collapsed Mini Pill */
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            title="Expand music player"
            aria-label="Expand music player"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-white/15 bg-black/75 backdrop-blur-md shadow-2xl hover:border-violet-500/40 hover:bg-black/90 transition-all text-zinc-300 hover:text-white cursor-pointer"
          >
            <span className="text-xs font-mono">♪</span>
          </button>
        ) : (
          /* Full Floating Pill */
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/15 bg-black/75 backdrop-blur-md shadow-2xl font-mono text-[11px]">
            {playRejected ? (
              /* Fallback when browser autoplay policy blocks unprompted audio */
              <button
                type="button"
                onClick={unmuteAndPlay}
                className="flex items-center gap-1.5 text-violet-300 hover:text-violet-100 transition-colors cursor-pointer"
              >
                <span className="text-xs text-violet-400">▶</span>
                <span>Tap to play music</span>
              </button>
            ) : (
              /* Normal Playing / Muted state */
              <>
                <button
                  type="button"
                  onClick={toggleMute}
                  title={isMuted ? 'Unmute music (Press M)' : 'Mute music (Press M)'}
                  className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors cursor-pointer tracking-wider"
                >
                  <span className="text-violet-400 font-bold">♪</span>
                  <span>
                    {isMuted ? 'MUTED · Shinigami' : 'NOW PLAYING · Shinigami'}
                  </span>

                  {/* 3 tiny violet equalizer bars */}
                  <div className="flex items-end gap-[2px] h-3 ml-0.5 pointer-events-none">
                    <span
                      className={`w-[2px] rounded-full transition-all duration-300 ${
                        isPlaying && !isMuted
                          ? 'bg-violet-400 animate-eq-1'
                          : 'bg-zinc-600 h-1.5'
                      }`}
                    />
                    <span
                      className={`w-[2px] rounded-full transition-all duration-300 ${
                        isPlaying && !isMuted
                          ? 'bg-violet-400 animate-eq-2'
                          : 'bg-zinc-600 h-1.5'
                      }`}
                    />
                    <span
                      className={`w-[2px] rounded-full transition-all duration-300 ${
                        isPlaying && !isMuted
                          ? 'bg-violet-400 animate-eq-3'
                          : 'bg-zinc-600 h-1.5'
                      }`}
                    />
                  </div>
                </button>

                {/* Speaker icon button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute music' : 'Mute music'}
                  title={isMuted ? 'Unmute music' : 'Mute music'}
                  className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer px-1 py-0.5 rounded hover:bg-white/10"
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>

                {/* Collapse button */}
                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  aria-label="Collapse music player"
                  title="Collapse"
                  className="text-zinc-500 hover:text-zinc-300 text-xs pl-0.5 cursor-pointer leading-none transition-colors"
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
