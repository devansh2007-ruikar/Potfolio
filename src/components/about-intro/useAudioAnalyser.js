import { useRef, useCallback, useEffect } from 'react'

/**
 * Hook to manage Web Audio API context, AnalyserNode, and real-time audio metrics.
 * Computes bass (20-150Hz), energy (all bins), and kick detection.
 * Stores output in a mutable ref for 60fps performance without React state re-renders.
 */
export function useAudioAnalyser(audioRef, { isMuted = false } = {}) {
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const gainNodeRef = useRef(null)
  const sourceNodeRef = useRef(null)
  const dataArrayRef = useRef(null)

  // Stored analysis ref accessed by render loops
  const audioDataRef = useRef({
    bass: 0,
    energy: 0,
    kick: false,
    t: 0,
    isMuted: false,
  })

  // Rolling history for 0.25s rolling average bass calculation
  const bassHistoryRef = useRef([])
  const lastKickTimeRef = useRef(0)
  const isFailedRef = useRef(false)

  // Keep mute state in sync
  useEffect(() => {
    audioDataRef.current.isMuted = isMuted
    if (gainNodeRef.current && audioContextRef.current) {
      try {
        const currentTime = audioContextRef.current.currentTime
        gainNodeRef.current.gain.setValueAtTime(isMuted ? 0 : 1, currentTime)
      } catch {
        // Fallback or context closed
      }
    }
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted, audioRef])

  /**
   * Initialize Web Audio API on user gesture (e.g., clicking ENTER)
   */
  const initAudio = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {})
      }
      return
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx || !audioRef.current) {
        isFailedRef.current = true
        return
      }

      const ctx = new AudioCtx()
      audioContextRef.current = ctx

      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      analyser.smoothingTimeConstant = 0.75
      analyserRef.current = analyser

      const gainNode = ctx.createGain()
      gainNode.gain.setValueAtTime(isMuted ? 0 : 1, ctx.currentTime)
      gainNodeRef.current = gainNode

      // Connect MediaElementSource safely (avoid re-attaching if same element)
      if (!sourceNodeRef.current) {
        sourceNodeRef.current = ctx.createMediaElementSource(audioRef.current)
      }

      // Graph: source -> analyser -> gainNode -> destination
      sourceNodeRef.current.connect(analyser)
      analyser.connect(gainNode)
      gainNode.connect(ctx.destination)

      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount)
      isFailedRef.current = false

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {})
      }
    } catch (err) {
      console.warn('Web Audio initialization fallback:', err)
      isFailedRef.current = true
    }
  }, [audioRef, isMuted])

  /**
   * Set volume programmatically (e.g. For fade-outs)
   */
  const setVolume = useCallback((volume) => {
    const clamped = Math.max(0, Math.min(1, volume))
    if (audioRef.current) {
      audioRef.current.volume = clamped
    }
    if (gainNodeRef.current && audioContextRef.current && !audioDataRef.current.isMuted) {
      try {
        gainNodeRef.current.gain.setValueAtTime(clamped, audioContextRef.current.currentTime)
      } catch {
        // Fallback
      }
    }
  }, [audioRef])

  /**
   * Update audio analysis for the current frame. Called every rAF frame.
   */
  const updateFrame = useCallback((currentTimeSec) => {
    const now = performance.now()
    audioDataRef.current.t = currentTimeSec

    // Fallback if analyser is unavailable or failed
    if (isFailedRef.current || !analyserRef.current || !dataArrayRef.current) {
      const fakeBass = Math.max(0, Math.min(1, 0.3 + 0.2 * Math.sin(currentTimeSec * 8)))
      const fakeEnergy = Math.max(0, Math.min(1, 0.3 + 0.15 * Math.sin(currentTimeSec * 4)))
      let fakeKick = false
      if (fakeBass > 0.46 && now - lastKickTimeRef.current > 180) {
        fakeKick = true
        lastKickTimeRef.current = now
      }

      audioDataRef.current.bass = fakeBass
      audioDataRef.current.energy = fakeEnergy
      audioDataRef.current.kick = fakeKick
      return audioDataRef.current
    }

    const analyser = analyserRef.current
    const dataArray = dataArrayRef.current
    analyser.getByteFrequencyData(dataArray)

    const sampleRate = audioContextRef.current ? audioContextRef.current.sampleRate : 44100
    const binHz = sampleRate / 1024
    const minBin = Math.max(0, Math.floor(20 / binHz))
    const maxBin = Math.min(dataArray.length - 1, Math.ceil(150 / binHz))

    // 1. Bass: 20-150 Hz bins average, normalized 0-1
    let bassSum = 0
    let bassCount = 0
    for (let i = minBin; i <= maxBin; i++) {
      bassSum += dataArray[i]
      bassCount++
    }
    const bass = bassCount > 0 ? bassSum / (bassCount * 255) : 0

    // 2. Energy: all bins average, normalized 0-1
    let energySum = 0
    for (let i = 0; i < dataArray.length; i++) {
      energySum += dataArray[i]
    }
    const energy = energySum / (dataArray.length * 255)

    // 3. Kick detection: bass > rollingAvg(0.25s) + 0.18, cooldown 180ms
    const history = bassHistoryRef.current
    history.push({ time: now, val: bass })
    // Evict items older than 250ms (0.25s)
    while (history.length > 0 && now - history[0].time > 250) {
      history.shift()
    }

    let rollingSum = 0
    for (let i = 0; i < history.length; i++) {
      rollingSum += history[i].val
    }
    const rollingAvg = history.length > 0 ? rollingSum / history.length : bass

    let kick = false
    if (bass - rollingAvg > 0.18 && now - lastKickTimeRef.current > 180) {
      kick = true
      lastKickTimeRef.current = now
    }

    audioDataRef.current.bass = bass
    audioDataRef.current.energy = energy
    audioDataRef.current.kick = kick

    return audioDataRef.current
  }, [])

  // Teardown audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {})
      }
    }
  }, [])

  return {
    audioDataRef,
    initAudio,
    updateFrame,
    setVolume,
  }
}
