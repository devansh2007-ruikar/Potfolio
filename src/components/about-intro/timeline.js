/**
 * TIMELINE CONFIGURATION
 * All timings are in seconds of audio.currentTime.
 * Easily tweak these values to adjust the timing of the cinematic intro.
 */
export const TIMELINE = {
  // Start of audio playback
  START: 0.0,

  // Particle vortex start (slow build-up)
  VORTEX_START: 0.0,

  // Text 1: "hey."
  HEY_START: 0.6,
  HEY_HOLD: 1.2,
  HEY_END: 1.8,

  // Text 2: "you found my file." (word-by-word drop)
  FILE_START: 1.9,
  FILE_STAGGER: 0.12,
  FILE_HOLD: 2.8,
  FILE_END: 3.3,

  // Text 3: "let me introduce myself..." (typewriter + bass jitter)
  INTRODUCE_START: 3.4,
  INTRODUCE_HOLD: 4.4,
  INTRODUCE_END: 4.9,

  // Tension Countdown: "03 → 02 → 01"
  COUNTDOWN_START: 5.0,
  COUNTDOWN_STEP: 0.4, // 5.0 -> 03, 5.4 -> 02, 5.8 -> 01
  COUNTDOWN_END: 6.3,

  // Particle Implosion: All dots collapse into a dense center ball
  IMPLODE_START: 6.2,

  // === THE BEAT DROP (exactly 6.5s) ===
  DROP: 6.5,
  DROP_FLASH_DURATION: 0.35, // White flash 1 -> 0 over 0.35s
  DROP_SHAKE_DURATION: 0.4,  // Screen shake decay over 0.4s

  // DOM Headline: "I'M DEVANSH." (slams in scale 2->1, RGB glitch 0.3s, fades out)
  DOM_NAME_START: 6.5,
  DOM_NAME_GLITCH_DURATION: 0.3,
  DOM_NAME_FADE_START: 7.1,
  DOM_NAME_END: 7.4,

  // Role Scrambles under the particle word
  ROLE_1_START: 7.5, // "PROBLEM SOLVER"
  ROLE_2_START: 8.3, // "BACKEND DEVELOPER"
  ROLE_3_START: 9.1, // "CREATIVE THINKER"
  ROLE_END: 9.6,

  // Dot-Matrix Halftone Portrait Mode
  PORTRAIT_START: 9.6,

  // Grid Snap & Fade Transition
  GRID_START: 11.0,
  BG_FADE_DURATION: 1.2,   // Canvas background fades black -> white over 1.2s
  AUDIO_FADE_DURATION: 2.0, // Audio volume fades to 0 over 2.0s

  // Intro completion
  END: 12.3,
}

export const ROLES = [
  'PROBLEM SOLVER',
  'BACKEND DEVELOPER',
  'CREATIVE THINKER',
]
