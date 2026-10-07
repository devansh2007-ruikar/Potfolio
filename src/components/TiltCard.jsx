import { createContext, useContext, useRef, useState, useEffect } from 'react'

export const TiltContext = createContext({
  disabled: false,
  setDisabled: () => {},
  resetTilt: () => {},
})

export function useTilt() {
  return useContext(TiltContext)
}

const TILT_MAX = 12 // max degrees of rotation
const SCALE = 1.02
const LIFT = 20 // translateZ pixels
const TRANSITION_OUT = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
const TRANSITION_IN = 'transform 0.12s ease-out'
const DEFAULT_TRANSFORM = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'

export default function TiltCard({ children, className = '', disabled: disabledProp = false }) {
  const cardRef = useRef(null)
  const [internalDisabled, setInternalDisabled] = useState(false)
  const isDisabled = disabledProp || internalDisabled

  const [style, setStyle] = useState({
    transform: DEFAULT_TRANSFORM,
    transition: TRANSITION_OUT,
  })

  function resetTilt() {
    setStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1,1,1)',
      transition: TRANSITION_OUT,
    })
  }

  // When disabled changes, reset tilt transform
  useEffect(() => {
    if (isDisabled) {
      resetTilt()
    }
  }, [isDisabled])

  function handleMouseMove(e) {
    if (isDisabled || document.body.style.overflow === 'hidden') return
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()

    // Cursor position relative to card center, normalized to -1..1
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const centerX = x - 0.5
    const centerY = y - 0.5

    // Invert axes: moving cursor right tilts card left edge toward viewer
    const rotateX = -centerY * TILT_MAX
    const rotateY = centerX * TILT_MAX

    setStyle({
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${LIFT}px) scale3d(${SCALE},${SCALE},${SCALE})`,
      transition: TRANSITION_IN,
    })
  }

  function handleMouseLeave() {
    if (isDisabled) return
    setStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1,1,1)',
      transition: TRANSITION_OUT,
    })
  }

  return (
    <TiltContext.Provider
      value={{
        disabled: isDisabled,
        setDisabled: setInternalDisabled,
        resetTilt,
      }}
    >
      <div
        ref={cardRef}
        className={className}
        style={{
          ...style,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </TiltContext.Provider>
  )
}
