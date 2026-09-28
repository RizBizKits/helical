const FOOTSTEP_SRC = "/sounds/footstep.mp3";

/** Play the climb footstep. Safe to call from click handlers (user gesture). */
export function playFootstep() {
  if (typeof window === "undefined") return;
  try {
    const audio = new Audio(FOOTSTEP_SRC);
    audio.volume = 0.75;
    void audio.play().catch(() => {
      // Autoplay may be blocked before any gesture; ignore.
    });
  } catch {
    // Ignore missing Audio support
  }
}
