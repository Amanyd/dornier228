let buttonAudio: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
  buttonAudio = new Audio('/assets/button.mp3');
  buttonAudio.preload = "auto";
}

let lastPlayTime = 0;

export const playGlobalClickSound = () => {
  if (typeof window === 'undefined' || !buttonAudio) return;
  
  const now = Date.now();
  // Throttle by 50ms to prevent double sounds from simultaneous triggers
  if (now - lastPlayTime < 50) return; 
  
  lastPlayTime = now;
  buttonAudio.currentTime = 0;
  buttonAudio.volume = 1.0;
  buttonAudio.play().catch((e) => console.log("Button audio failed", e));
};
