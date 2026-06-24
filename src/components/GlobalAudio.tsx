"use client";

import { useEffect, useRef } from 'react';

export default function GlobalAudio() {
  const themeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/assets/theme.mp3');
    audio.loop = true;
    audio.volume = 0.15; // Lower volume for background theme
    themeAudioRef.current = audio;

    const tryPlay = () => {
      audio.play().catch(e => console.log('Autoplay blocked, waiting for interaction:', e));
    };

    // Attempt to play immediately
    tryPlay();

    // Start playing as soon as the user interacts with the document
    const startAudio = () => {
      if (themeAudioRef.current && themeAudioRef.current.paused) {
        themeAudioRef.current.play().catch(console.error);
      }
      document.removeEventListener('click', startAudio);
      document.removeEventListener('keydown', startAudio);
    };

    document.addEventListener('click', startAudio);
    document.addEventListener('keydown', startAudio);

    return () => {
      audio.pause();
      document.removeEventListener('click', startAudio);
      document.removeEventListener('keydown', startAudio);
    };
  }, []);

  return null;
}
