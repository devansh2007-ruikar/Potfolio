import { useState, useEffect } from 'react'

export function useTypewriter(lines, typingSpeed = 28, pauseTime = 250, shouldReduceMotion = false) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (shouldReduceMotion) {
      setCurrentLineIndex(lines.length)
      setCurrentCharIndex(0)
      setIsComplete(true)
      return
    }

    if (currentLineIndex >= lines.length) {
      setIsComplete(true)
      return
    }

    const currentLine = lines[currentLineIndex]

    if (currentCharIndex < currentLine.length) {
      const charTimer = setTimeout(() => {
        setCurrentCharIndex((prev) => prev + 1)
      }, typingSpeed)
      return () => clearTimeout(charTimer)
    } else {
      // Completed current line, pause before moving to next line
      const lineTimer = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1)
        setCurrentCharIndex(0)
      }, pauseTime)
      return () => clearTimeout(lineTimer)
    }
  }, [currentLineIndex, currentCharIndex, lines, typingSpeed, pauseTime, shouldReduceMotion])

  const displayedLines = lines
    .slice(0, currentLineIndex + 1)
    .map((line, idx) => {
      if (shouldReduceMotion) return line
      if (idx < currentLineIndex) return line
      return line.slice(0, currentCharIndex)
    })

  return {
    displayedLines,
    isComplete,
    currentLineIndex,
  }
}
