import { createContext, useContext } from 'react'

export const TiltContext = createContext({
  disabled: false,
  setDisabled: () => {},
  resetTilt: () => {},
})

export function useTilt() {
  return useContext(TiltContext)
}
