import { createContext, useState, useRef, useEffect, useCallback } from 'react'

const MusicContext = createContext({
  isPlaying: false,
  isMuted: false,
  showMutedHint: false,
  playRejected: false,
  enterAboutMe: () => {},
  leaveAboutMe: () => {},
  toggleMute: () => {},
  warmUp: () => {},
  startAboutMeMusic: () => {},
  leaveAboutMeMusic: () => {},
  unmuteAndPlay: () => {},
  toggle: () => {},
})

const TARGET_VOLUME = 0.35

export function MusicProvider({ children }) {
  // Read initial mute preference from localStorage
  const initialMuted = (() => {
    try {
      return localStorage.getItem('music-muted') === 'true'
    } catch {
      return false
    }
  })()

  // Source of truth in refs
  const mutedRef = useRef(initialMuted)
  const wantPlayRef = useRef(false)
  const wasPlayingBeforeHideRef = useRef(false)
  const fadeRafRef = useRef(null)
  const hintTimeoutRef = useRef(null)
  const audioRef = useRef(null)

  // React state mirrored for UI rendering
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(initialMuted)
  const [showMutedHint, setShowMutedHint] = useState(false)
  const [playRejected, setPlayRejected] = useState(false)

  /**
   * Helper: fadeTo(target, ms, onDone)
   * Animates audio.volume with requestAnimationFrame. Clamps volume to 0–1.
   * Cancels any previous fade (stored in fadeRafRef).
   */
  const fadeTo = useCallback((target, ms, onDone) => {
    const audio = audioRef.current
    if (!audio) return

    if (fadeRafRef.current) {
      cancelAnimationFrame(fadeRafRef.current)
      fadeRafRef.current = null
    }

    const clampedTarget = Math.max(0, Math.min(1, target))
    const startVol = Math.max(0, Math.min(1, audio.volume))
    const diff = clampedTarget - startVol

    if (ms <= 0 || Math.abs(diff) < 0.005) {
      audio.volume = clampedTarget
      onDone?.()
      return
    }

    const startTime = performance.now()

    const step = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / ms)
      audio.volume = Math.max(0, Math.min(1, startVol + diff * progress))

      if (progress < 1) {
        fadeRafRef.current = requestAnimationFrame(step)
      } else {
        audio.volume = clampedTarget
        fadeRafRef.current = null
        onDone?.()
      }
    }

    fadeRafRef.current = requestAnimationFrame(step)
  }, [])

  const fadeToRef = useRef(fadeTo)
  fadeToRef.current = fadeTo

  /**
   * Only unmount effect may cancel fades
   */
  useEffect(() => {
    return () => {
      if (fadeRafRef.current) {
        cancelAnimationFrame(fadeRafRef.current)
        fadeRafRef.current = null
      }
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current)
      }
    }
  }, [])

  /**
   * Mirror audio element events to isPlaying state
   */
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onPlaying = () => {
      setIsPlaying(true)
      setPlayRejected(false)
    }
    const onPause = () => {
      setIsPlaying(false)
    }

    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('pause', onPause)
    }
  }, [])

  /**
   * visibilitychange listener reading strictly from refs (deps [])
   */
  useEffect(() => {
    const handleVisibility = () => {
      const audio = audioRef.current
      if (!audio) return

      if (document.hidden) {
        if (!audio.paused && wantPlayRef.current && !mutedRef.current) {
          wasPlayingBeforeHideRef.current = true
          audio.pause()
        }
      } else {
        if (wasPlayingBeforeHideRef.current && wantPlayRef.current && !mutedRef.current) {
          wasPlayingBeforeHideRef.current = false
          const playPromise = audio.play()
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                fadeToRef.current?.(TARGET_VOLUME, 400)
              })
              .catch(() => {})
          }
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  /**
   * Warm up audio on hover/focus if readyState is 0
   */
  const warmUp = useCallback(() => {
    const audio = audioRef.current
    if (audio && audio.readyState === 0) {
      audio.load()
    }
  }, [])

  /**
   * enterAboutMe() - Called strictly inside About Me click event
   */
  const enterAboutMe = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    // If muted: don't play, but show muted hint for 4s
    if (mutedRef.current) {
      wantPlayRef.current = false
      setShowMutedHint(true)
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current)
      hintTimeoutRef.current = setTimeout(() => {
        setShowMutedHint(false)
      }, 4000)
      return
    }

    wantPlayRef.current = true
    setShowMutedHint(false)
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current)

    if (audio.paused) {
      audio.volume = 0
      const playPromise = audio.play()
      fadeTo(TARGET_VOLUME, 1200)
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlayRejected(false)
          })
          .catch((err) => {
            console.warn('Playback prevented by browser policy:', err)
            setPlayRejected(true)
            audio.volume = 0
          })
      }
    } else {
      fadeTo(TARGET_VOLUME, 400)
    }
  }, [fadeTo])

  /**
   * leaveAboutMe() - Fade out over 0.8s and pause (keeps currentTime)
   */
  const leaveAboutMe = useCallback(() => {
    wantPlayRef.current = false
    setShowMutedHint(false)
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current)

    const audio = audioRef.current
    if (!audio || audio.paused) return

    fadeTo(0, 800, () => {
      audio.pause()
    })
  }, [fadeTo])

  /**
   * toggleMute() - Based on mutedRef.current
   */
  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    setShowMutedHint(false)
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current)

    if (!mutedRef.current) {
      // MUTE: save 'true', fade to 0 over 400ms, then pause
      mutedRef.current = true
      wantPlayRef.current = false
      setIsMuted(true)
      try {
        localStorage.setItem('music-muted', 'true')
      } catch {
        // ignore
      }

      fadeTo(0, 400, () => {
        audio.pause()
      })
    } else {
      // UNMUTE: save 'false', audio.play() synchronously, fade to 0.35 over 800ms
      mutedRef.current = false
      wantPlayRef.current = true
      setIsMuted(false)
      setPlayRejected(false)
      try {
        localStorage.setItem('music-muted', 'false')
      } catch {
        // ignore
      }

      audio.volume = 0
      const playPromise = audio.play()
      fadeTo(TARGET_VOLUME, 800)
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlayRejected(false)
          })
          .catch((err) => {
            console.warn('Playback prevented:', err)
            setPlayRejected(true)
          })
      }
    }
  }, [fadeTo])

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        isMuted,
        showMutedHint,
        playRejected,
        enterAboutMe,
        leaveAboutMe,
        toggleMute,
        warmUp,
        startAboutMeMusic: enterAboutMe,
        leaveAboutMeMusic: leaveAboutMe,
        unmuteAndPlay: toggleMute,
        toggle: toggleMute,
      }}
    >
      <audio
        ref={audioRef}
        src="/music/theme.mp3"
        loop
        preload="auto"
        playsInline
      />
      {children}
    </MusicContext.Provider>
  )
}

export { MusicContext }
