import { useState, useEffect, useRef, useCallback } from 'react'
import { useInView } from 'framer-motion'

const CHARS = '!<>-_\\/[]{}—=+*^?#_01'

export default function DecryptText({
  text,
  speed = 30,
  delay = 0,
  trigger,
  className = '',
}) {
  const [displayText, setDisplayText] = useState(text)
  const [, setIsScrambling] = useState(false)

  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-10% 0px' })
  const [hasAnimated, setHasAnimated] = useState(false)

  const timeoutRef = useRef(null)
  const intervalRef = useRef(null)
  const prevTriggerRef = useRef(trigger)
  const isFirstMount = useRef(true)

  // Keep displayText in sync if text prop changes
  useEffect(() => {
    setDisplayText(text)
  }, [text])

  const runScramble = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)

    const execute = () => {
      setIsScrambling(true)
      let iteration = 0

      intervalRef.current = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              // Keep spaces as spaces to preserve word wrapping
              if (char === ' ') return ' '

              // If the character is before the current iteration, reveal the true character
              if (index < iteration) {
                return text[index]
              }

              // Otherwise, show a random hacker character
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            })
            .join('')
        )

        // Stop condition: when we've iterated past all characters
        if (iteration >= text.length) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          setIsScrambling(false)
        }

        // Increment by a fraction to control reveal speed
        iteration += 1 / 3
      }, speed)
    }

    if (delay > 0) {
      timeoutRef.current = setTimeout(execute, delay)
    } else {
      execute()
    }
  }, [text, speed, delay])

  // Trigger handling & default in-view fallback
  useEffect(() => {
    // Default in-view behavior when trigger is not provided
    if (trigger === undefined) {
      if (isInView && !hasAnimated) {
        runScramble()
        setHasAnimated(true)
      }
      return
    }

    // Trigger-based behavior when trigger prop is provided
    if (isFirstMount.current) {
      isFirstMount.current = false
      if (trigger) {
        runScramble()
      }
    } else if (trigger !== prevTriggerRef.current || trigger) {
      runScramble()
    }

    prevTriggerRef.current = trigger
  }, [trigger, isInView, hasAnimated, runScramble])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <span
      ref={containerRef}
      onMouseEnter={runScramble}
      className={`font-mono inline-block ${className}`}
    >
      {displayText}
    </span>
  )
}
