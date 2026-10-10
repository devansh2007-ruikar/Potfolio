import { createContext, useState, useRef, useEffect, useCallback } from 'react'

const MusicContext = createContext({
  isPlaying: false,
  isMuted: false,
  playRejected: false,
  startAboutMeMusic: () => {},
  leaveAboutMeMusic: () => {},
  toggleMute: () => {},
  unmuteAndPlay: () => {},
  toggle: () => {},
})

const TARGET_VOLUME = 0.35
const FADE_IN_ABOUT_MS = 1200
const FADE_OUT_LEAVE_MS = 800
const FADE_OUT_MUTE_MS = 400

export function MusicProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playRejected, setPlayRejected] = useState(false)
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem('music-muted') === 'true'
    } catch {
      return false
    }
  })

  const audioRef = useRef(null)
  const fadeTimerRef = useRef(null)
  const wasPlayingBeforeHideRef = useRef(false)

  // Auto-start on entering About Me (directly in click handler)
  const startAboutMeMusic = useCallback(() => {
    try {
      const isUserMuted = localStorage.getItem('music-muted') === 'true'
      if (isUserMuted) {
        return
      }
    } catch {
      // Storage unavailable fallback
    }

    const audio = audioRef.current
    if (!audio) return

    if (fadeTimerRef.current) cancelAnimationFrame(fadeTimerRef.current)

    // If already playing at full target volume, don't restart
    if (!audio.paused && audio.volume >= TARGET_VOLUME * 0.9) {
      setIsPlaying(true)
      return
    }

    audio.volume = 0
    const playPromise = audio.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true)
          setIsMuted(false)
          setPlayRejected(false)
          try {
            localStorage.setItem('music-muted', 'false')
          } catch {
            // ignore
          }

          const startTime = performance.now()
          const fadeInLoop = (now) => {
            const elapsed = now - startTime
            const progress = Math.min(1, elapsed / FADE_IN_ABOUT_MS)
            audio.volume = progress * TARGET_VOLUME

            if (progress < 1) {
              fadeTimerRef.current = requestAnimationFrame(fadeInLoop)
            } else {
              audio.volume = TARGET_VOLUME
              fadeTimerRef.current = null
            }
          }
          fadeTimerRef.current = requestAnimationFrame(fadeInLoop)
        })
        .catch((err) => {
          console.warn('Playback prevented by browser policy:', err)
          setIsPlaying(false)
          setPlayRejected(true)
        })
    }
  }, [])

  // Fade out over 0.8s and pause when leaving About Me
  const leaveAboutMeMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio || audio.paused) return

    if (fadeTimerRef.current) cancelAnimationFrame(fadeTimerRef.current)

    const startVol = audio.volume
    const startTime = performance.now()

    const fadeOutLoop = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / FADE_OUT_LEAVE_MS)
      audio.volume = Math.max(0, startVol * (1 - progress))

      if (progress < 1) {
        fadeTimerRef.current = requestAnimationFrame(fadeOutLoop)
      } else {
        audio.pause() // Preserves currentTime so it resumes seamlessly
        audio.volume = 0
        setIsPlaying(false)
        fadeTimerRef.current = null
      }
    }
    fadeTimerRef.current = requestAnimationFrame(fadeOutLoop)
  }, [])

  // Toggle Mute: mute (fade 0.4s -> pause) or unmute (play -> fade 1.2s to 0.35)
  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (fadeTimerRef.current) cancelAnimationFrame(fadeTimerRef.current)

    if (isPlaying && !isMuted) {
      // MUTE
      setIsMuted(true)
      try {
        localStorage.setItem('music-muted', 'true')
      } catch {
        // ignore
      }

      const startVol = audio.volume
      const startTime = performance.now()

      const fadeOutLoop = (now) => {
        const elapsed = now - startTime
        const progress = Math.min(1, elapsed / FADE_OUT_MUTE_MS)
        audio.volume = Math.max(0, startVol * (1 - progress))

        if (progress < 1) {
          fadeTimerRef.current = requestAnimationFrame(fadeOutLoop)
        } else {
          audio.pause()
          audio.volume = 0
          setIsPlaying(false)
          fadeTimerRef.current = null
        }
      }
      fadeTimerRef.current = requestAnimationFrame(fadeOutLoop)
    } else {
      // UNMUTE & PLAY
      setIsMuted(false)
      setPlayRejected(false)
      try {
        localStorage.setItem('music-muted', 'false')
      } catch {
        // ignore
      }

      audio.volume = 0
      const playPromise = audio.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            const startTime = performance.now()
            const fadeInLoop = (now) => {
              const elapsed = now - startTime
              const progress = Math.min(1, elapsed / FADE_IN_ABOUT_MS)
              audio.volume = progress * TARGET_VOLUME

              if (progress < 1) {
                fadeTimerRef.current = requestAnimationFrame(fadeInLoop)
              } else {
                audio.volume = TARGET_VOLUME
                fadeTimerRef.current = null
              }
            }
            fadeTimerRef.current = requestAnimationFrame(fadeInLoop)
          })
          .catch((err) => {
            console.warn('Playback prevented by browser policy:', err)
            setIsPlaying(false)
            setPlayRejected(true)
          })
      }
    }
  }, [isPlaying, isMuted])

  // Explicit un-mute and play for tap fallback
  const unmuteAndPlay = useCallback(() => {
    setIsMuted(false)
    setPlayRejected(false)
    try {
      localStorage.setItem('music-muted', 'false')
    } catch {
      // ignore
    }

    const audio = audioRef.current
    if (!audio) return

    if (fadeTimerRef.current) cancelAnimationFrame(fadeTimerRef.current)

    audio.volume = 0
    audio
      .play()
      .then(() => {
        setIsPlaying(true)
        const startTime = performance.now()
        const fadeInLoop = (now) => {
          const elapsed = now - startTime
          const progress = Math.min(1, elapsed / FADE_IN_ABOUT_MS)
          audio.volume = progress * TARGET_VOLUME

          if (progress < 1) {
            fadeTimerRef.current = requestAnimationFrame(fadeInLoop)
          } else {
            audio.volume = TARGET_VOLUME
            fadeTimerRef.current = null
          }
        }
        fadeTimerRef.current = requestAnimationFrame(fadeInLoop)
      })
      .catch((err) => {
        console.warn('Play prevented:', err)
        setPlayRejected(true)
      })
  }, [])

  // Visibility Change: pause when tab hidden, resume when tab visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current
      if (!audio) return

      if (document.hidden) {
        if (!audio.paused && isPlaying && !isMuted) {
          wasPlayingBeforeHideRef.current = true
          audio.pause()
        }
      } else {
        if (wasPlayingBeforeHideRef.current && !isMuted) {
          wasPlayingBeforeHideRef.current = false
          audio.volume = TARGET_VOLUME
          audio.play().catch(() => {})
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (fadeTimerRef.current) cancelAnimationFrame(fadeTimerRef.current)
    }
  }, [isPlaying, isMuted])

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        isMuted,
        playRejected,
        startAboutMeMusic,
        leaveAboutMeMusic,
        toggleMute,
        unmuteAndPlay,
        toggle: toggleMute,
      }}
    >
      <audio
        ref={audioRef}
        src="/music/theme.mp3"
        loop
        preload="none"
        playsInline
      />
      {children}
    </MusicContext.Provider>
  )
}

export { MusicContext }
