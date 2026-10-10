import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import ParticleField from './ParticleField'
import KineticText from './KineticText'
import { useAudioAnalyser } from './useAudioAnalyser'
import { TIMELINE } from './timeline'

/**
 * AudioIntro - Cinematic audio-reactive intro for the About Me page.
 * Manages full-screen overlay, gate screen, master rAF clock, kinetic text, and particle modes.
 */
export default function AudioIntro({
  onComplete,
  onIntroActiveChange,
  isMuted = false,
  onToggleMute,
}) {
  const shouldReduceMotion = useReducedMotion()
  const audioRef = useRef(null)

  // Gate & Playback states
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGateVisible, setIsGateVisible] = useState(true)
  const [particleMode, setParticleMode] = useState('idle')
  const [currentSegment, setCurrentSegment] = useState('idle')
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [audioLoadProgress, setAudioLoadProgress] = useState(0)
  const [isAudioReady, setIsAudioReady] = useState(false)
  const [audioFailed, setAudioFailed] = useState(false)

  // Camera Shake & Flash states
  const [cameraShake, setCameraShake] = useState({ x: 0, y: 0 })
  const [edgeGlow, setEdgeGlow] = useState(0) // 0 to 80px inset glow
  const [whiteFlashOpacity, setWhiteFlashOpacity] = useState(0)

  // Web Audio Hook
  const { audioDataRef, initAudio, updateFrame, setVolume } = useAudioAnalyser(
    audioRef,
    { isMuted }
  )

  const isEndingRef = useRef(false)
  const rAFRef = useRef(null)

  // Lock scroll on mount, unlock on unmount
  useEffect(() => {
    document.documentElement.classList.add('no-scroll')
    onIntroActiveChange?.(true)
    const audioElement = audioRef.current

    return () => {
      document.documentElement.classList.remove('no-scroll')
      onIntroActiveChange?.(false)
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current)
      if (audioElement) {
        audioElement.pause()
        audioElement.currentTime = 0
      }
    }
  }, [onIntroActiveChange])

  // Track audio preloading
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleProgress = () => {
      if (audio.buffered.length > 0 && audio.duration > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1)
        const progress = Math.min(1, bufferedEnd / audio.duration)
        setAudioLoadProgress(progress)
        if (progress >= 0.85 || audio.readyState >= 3) {
          setIsAudioReady(true)
        }
      }
    }

    const handleCanPlayThrough = () => {
      setAudioLoadProgress(1)
      setIsAudioReady(true)
    }

    const handleError = () => {
      console.warn('Audio failed to load, fallback ready.')
      setAudioFailed(true)
      setIsAudioReady(true)
    }

    audio.addEventListener('progress', handleProgress)
    audio.addEventListener('canplaythrough', handleCanPlayThrough)
    audio.addEventListener('canplay', handleCanPlayThrough)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('progress', handleProgress)
      audio.removeEventListener('canplaythrough', handleCanPlayThrough)
      audio.removeEventListener('canplay', handleCanPlayThrough)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  // Terminate intro and notify parent to scroll to manifesto
  const handleFinish = useCallback(() => {
    if (isEndingRef.current) return
    isEndingRef.current = true

    if (rAFRef.current) cancelAnimationFrame(rAFRef.current)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    sessionStorage.setItem('introSeen', 'true')
    document.documentElement.classList.remove('no-scroll')
    onIntroActiveChange?.(false)

    onComplete?.()
  }, [onComplete, onIntroActiveChange])

  // User clicked ▶ ENTER on Gate screen
  const handleStartIntro = useCallback(() => {
    if (shouldReduceMotion) {
      // Reduced motion: skip animation directly
      handleFinish()
      return
    }

    initAudio()
    setIsGateVisible(false)

    if (audioRef.current && !audioFailed) {
      audioRef.current.currentTime = 0
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
          setParticleMode('vortex')
        })
        .catch((err) => {
          console.warn('Audio playback error, running synthetic timeline:', err)
          setIsPlaying(true)
          setParticleMode('vortex')
        })
    } else {
      setIsPlaying(true)
      setParticleMode('vortex')
    }
  }, [shouldReduceMotion, initAudio, audioFailed, handleFinish])

  // Skip Intro button or Esc key
  const handleSkip = useCallback(() => {
    if (isEndingRef.current) return

    if (!isPlaying) {
      handleFinish()
      return
    }

    // Switch particles to grid and fade audio out quickly (0.4s)
    setParticleMode('grid')
    let fadeStep = 1.0
    const fadeInterval = setInterval(() => {
      fadeStep -= 0.08
      if (fadeStep <= 0) {
        clearInterval(fadeInterval)
        handleFinish()
      } else {
        setVolume(fadeStep)
      }
    }, 32)
  }, [isPlaying, handleFinish, setVolume])

  // ESC key listener to skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleSkip()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSkip])

  // MASTER CLOCK & TIMELINE RAF LOOP
  useEffect(() => {
    if (!isPlaying || isEndingRef.current) return

    let syntheticStartTime = performance.now()

    const loop = () => {
      if (isEndingRef.current) return

      let t = 0
      if (audioRef.current && !audioRef.current.paused && audioRef.current.currentTime > 0) {
        t = audioRef.current.currentTime
      } else {
        // Synthetic clock fallback
        t = (performance.now() - syntheticStartTime) / 1000
      }

      setAudioCurrentTime(t)
      updateFrame(t)

      // 1. PARTICLE MODE DRIVER
      if (t < TIMELINE.IMPLODE_START) {
        setParticleMode('vortex')
      } else if (t < TIMELINE.DROP) {
        setParticleMode('implode')
      } else if (t < TIMELINE.PORTRAIT_START) {
        setParticleMode('text')
      } else if (t < TIMELINE.GRID_START) {
        setParticleMode('portrait')
      } else {
        setParticleMode('grid')
      }

      // 2. KINETIC TEXT SEGMENT DRIVER
      if (t < TIMELINE.HEY_START) {
        setCurrentSegment('idle')
      } else if (t < TIMELINE.FILE_START) {
        setCurrentSegment('hey')
      } else if (t < TIMELINE.INTRODUCE_START) {
        setCurrentSegment('file')
      } else if (t < TIMELINE.COUNTDOWN_START) {
        setCurrentSegment('introduce')
      } else if (t < TIMELINE.IMPLODE_START) {
        setCurrentSegment('countdown')
      } else if (t < TIMELINE.DROP) {
        setCurrentSegment('implode')
      } else if (t < TIMELINE.ROLE_1_START) {
        setCurrentSegment('drop_name')
      } else if (t < TIMELINE.ROLE_2_START) {
        setCurrentSegment('role_1')
      } else if (t < TIMELINE.ROLE_3_START) {
        setCurrentSegment('role_2')
      } else if (t < TIMELINE.PORTRAIT_START) {
        setCurrentSegment('role_3')
      } else if (t < TIMELINE.GRID_START) {
        setCurrentSegment('portrait')
      } else {
        setCurrentSegment('grid')
      }

      // 3. TENSION EFFECTS (5.0 - 6.3s)
      if (t >= TIMELINE.COUNTDOWN_START && t < TIMELINE.IMPLODE_START) {
        const tensionProg = (t - TIMELINE.COUNTDOWN_START) / (TIMELINE.IMPLODE_START - TIMELINE.COUNTDOWN_START)
        // Violet inner glow grows up to 75px
        setEdgeGlow(Math.round(tensionProg * 75))
        // Camera shake grows from 0 to ±3px
        const shakeMag = tensionProg * 3.0
        setCameraShake({
          x: (Math.random() - 0.5) * 2 * shakeMag,
          y: (Math.random() - 0.5) * 2 * shakeMag,
        })
      } else if (t >= TIMELINE.DROP && t < TIMELINE.DROP + TIMELINE.DROP_SHAKE_DURATION) {
        // DROP CAMERA SHAKE: decays from ±8px over 0.4s
        const dropProg = 1 - (t - TIMELINE.DROP) / TIMELINE.DROP_SHAKE_DURATION
        const dropMag = Math.max(0, dropProg * 8.0)
        setCameraShake({
          x: (Math.random() - 0.5) * 2 * dropMag,
          y: (Math.random() - 0.5) * 2 * dropMag,
        })
        setEdgeGlow(0)
      } else {
        setCameraShake({ x: 0, y: 0 })
        setEdgeGlow(0)
      }

      // 4. WHITE FLASH EFFECT ON THE DROP (6.5s)
      if (t >= TIMELINE.DROP && t < TIMELINE.DROP + TIMELINE.DROP_FLASH_DURATION) {
        const flashProg = 1 - (t - TIMELINE.DROP) / TIMELINE.DROP_FLASH_DURATION
        setWhiteFlashOpacity(Math.max(0, flashProg))
      } else {
        setWhiteFlashOpacity(0)
      }

      // 5. AUDIO FADE-OUT (starts at 11.0s over 2.0s)
      if (t >= TIMELINE.GRID_START) {
        const fadeProg = Math.max(0, Math.min(1, (t - TIMELINE.GRID_START) / TIMELINE.AUDIO_FADE_DURATION))
        setVolume(1.0 - fadeProg)
      }

      // 6. END OF INTRO (12.3s)
      if (t >= TIMELINE.END) {
        handleFinish()
        return
      }

      rAFRef.current = requestAnimationFrame(loop)
    }

    rAFRef.current = requestAnimationFrame(loop)

    return () => {
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current)
    }
  }, [isPlaying, updateFrame, setVolume, handleFinish])

  // ACCESSIBILITY: Reduced Motion Fallback Screen
  if (shouldReduceMotion) {
    return (
      <div className="fixed inset-0 z-[90] bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none">
        <span className="text-[11px] font-mono tracking-[0.3em] text-zinc-500 uppercase mb-3">
          CASE-000 · ARCHIVE
        </span>
        <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight mb-4">
          I&apos;M DEVANSH.
        </h1>
        <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase mb-8">
          PROBLEM SOLVER · BACKEND DEVELOPER · CREATIVE THINKER
        </p>
        <button
          onClick={handleFinish}
          className="px-6 py-3 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-xs font-mono tracking-widest uppercase text-white transition-colors cursor-pointer"
        >
          Continue to Portfolio →
        </button>
      </div>
    )
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cinematic audio intro"
      className="fixed inset-0 z-[90] bg-black overflow-hidden select-none"
      style={{
        boxShadow: edgeGlow > 0 ? `inset 0 0 ${edgeGlow}px rgba(167, 139, 250, 0.5)` : 'none',
        transform: `translate(${cameraShake.x}px, ${cameraShake.y}px)`,
        transition: 'box-shadow 0.1s ease-out',
      }}
    >
      {/* Audio element as master clock */}
      <audio
        ref={audioRef}
        src="/intro/intro-music-12s.mp3"
        preload="auto"
        playsInline
      />

      {/* 1. Particle Canvas Engine */}
      <ParticleField
        mode={particleMode}
        audioDataRef={audioDataRef}
        currentTime={audioCurrentTime}
      />

      {/* 2. Full white flash overlay (6.5s beat drop) */}
      {whiteFlashOpacity > 0 && (
        <div
          aria-hidden="true"
          style={{ opacity: whiteFlashOpacity }}
          className="absolute inset-0 bg-white z-30 pointer-events-none transition-none"
        />
      )}

      {/* 3. Kinetic Typography Layer */}
      {isPlaying && (
        <KineticText
          segment={currentSegment}
          audioTime={audioCurrentTime}
          audioDataRef={audioDataRef}
          shouldReduceMotion={shouldReduceMotion}
        />
      )}

      {/* 4. GATE SCREEN UI (Overlay fades in 0.3s on ▶ click) */}
      <AnimatePresence>
        {isGateVisible && (
          <motion.div
            key="gate"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 text-center select-none"
          >
            {/* Top mono label */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <span className="text-[11px] font-mono tracking-[0.3em] text-zinc-500 uppercase">
                CASE-000 · AUDIO FILE
              </span>
            </motion.div>

            {/* Round 88px button with ▶ icon and pulsing violet ring */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative group mb-5"
            >
              {/* Slowly pulsing violet ring */}
              <div
                className="absolute -inset-3 rounded-full border border-violet-500/40 opacity-70 animate-ping pointer-events-none"
                style={{ animationDuration: '2.5s' }}
              />
              <div className="absolute -inset-1.5 rounded-full bg-violet-600/20 blur-md pointer-events-none" />

              <button
                type="button"
                onClick={handleStartIntro}
                aria-label="Enter cinematic intro"
                className="relative w-[88px] h-[88px] rounded-full border border-white/20 bg-black/80 hover:bg-white/10 hover:border-violet-400 flex items-center justify-center cursor-pointer transition-colors shadow-2xl group"
              >
                {/* Play Triangle */}
                <svg
                  className="w-8 h-8 text-white ml-1 group-hover:scale-110 group-hover:text-violet-300 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </motion.div>

            {/* Under button: "ENTER" and sound note */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-1.5"
            >
              <div className="font-mono text-sm tracking-[0.25em] text-zinc-200 font-bold uppercase">
                ENTER
              </div>
              <div className="text-xs text-zinc-600 font-sans flex items-center justify-center gap-1">
                <span>🎧</span>
                <span>sound on for the full experience</span>
              </div>
            </motion.div>

            {/* Preload progress line indicator (until can play through) */}
            {!isAudioReady && (
              <div className="mt-6 w-36 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-400 to-amber-400 transition-all duration-300"
                  style={{ width: `${Math.max(15, audioLoadProgress * 100)}%` }}
                />
              </div>
            )}

            {/* Bottom-right: "Skip intro →" on gate */}
            <button
              type="button"
              onClick={handleFinish}
              className="absolute bottom-6 right-6 px-4 py-2 text-[11px] font-mono tracking-widest uppercase text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              Skip intro →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. CONTROLS DURING PLAYBACK (Bottom-right pills) */}
      {isPlaying && (
        <div className="absolute bottom-6 right-6 z-40 flex items-center gap-2 select-none">
          {/* Mute Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute intro audio' : 'Mute intro audio'}
            className="px-3 py-1.5 rounded-full border border-white/15 bg-black/70 hover:bg-white/10 backdrop-blur-md text-[11px] font-mono tracking-wider uppercase text-zinc-400 hover:text-white transition-colors cursor-pointer shadow-lg flex items-center gap-1.5"
          >
            <span>{isMuted ? '🔇' : '🔊'}</span>
            <span className="hidden sm:inline">{isMuted ? 'MUTED' : 'MUTE'}</span>
          </button>

          {/* Skip Intro */}
          <button
            type="button"
            onClick={handleSkip}
            aria-label="Skip cinematic intro"
            className="px-4 py-1.5 rounded-full border border-white/15 bg-black/70 hover:bg-white/10 backdrop-blur-md text-[11px] font-mono tracking-widest uppercase text-zinc-300 hover:text-white hover:border-violet-400 transition-colors cursor-pointer shadow-lg flex items-center gap-1"
          >
            <span>SKIP</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* 6. THIN BOTTOM PROGRESS BAR (2px, violet → amber) */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-50 pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-violet-400 to-amber-400"
            style={{
              width: `${Math.min(100, (audioCurrentTime / TIMELINE.END) * 100)}%`,
            }}
          />
        </div>
      )}
    </div>
  )
}
