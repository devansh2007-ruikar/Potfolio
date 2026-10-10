import { useContext } from 'react'
import { MusicContext } from './MusicContext'

export function useMusic() {
  return useContext(MusicContext)
}
