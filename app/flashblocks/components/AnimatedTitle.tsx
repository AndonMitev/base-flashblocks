'use client';

import React, { useEffect, useState, useRef } from 'react';

interface AnimatedTitleProps {
  text: string;
  className?: string;
  onComplete?: () => void;
  speed?: number;
  delay?: number;
  scrambleIntensity?: number;
}

// Characters to use for scrambling effect
const SCRAMBLE_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  text,
  className = '',
  onComplete,
  speed = 100,
  delay = 0,
  scrambleIntensity = 3
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const hasStartedRef = useRef(false);
  const scrambleTimersRef = useRef<NodeJS.Timeout[]>([]);
  const finalTextRef = useRef('');

  // Clear all scramble timers on unmount
  useEffect(() => {
    return () => {
      scrambleTimersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  // Typewriter effect with scramble
  useEffect(() => {
    let startTimeout: NodeJS.Timeout;
    finalTextRef.current = text;

    if (!hasStartedRef.current) {
      startTimeout = setTimeout(() => {
        hasStartedRef.current = true;
        let currentIndex = 0;

        const typingInterval = setInterval(() => {
          if (currentIndex <= text.length) {
            // Set the current stable part of the text
            const stableText = text.slice(0, currentIndex);
            setDisplayText(stableText);

            // Add scramble effect for upcoming characters
            if (currentIndex < text.length) {
              // Clear previous scramble timers
              scrambleTimersRef.current.forEach((timer) => clearTimeout(timer));
              scrambleTimersRef.current = [];

              // Create scramble effect for the next few characters
              for (
                let i = 0;
                i < scrambleIntensity && currentIndex + i < text.length;
                i++
              ) {
                const charIndex = currentIndex + i;
                const scrambleCount = Math.max(
                  1,
                  Math.floor((scrambleIntensity - i) * 3)
                );

                for (let j = 0; j < scrambleCount; j++) {
                  const timer = setTimeout(() => {
                    setDisplayText((prev) => {
                      // Don't scramble if typing is complete
                      if (isTypingComplete) return finalTextRef.current;

                      const randomChar = SCRAMBLE_CHARS.charAt(
                        Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                      );
                      const scrambledText =
                        stableText +
                        prev.slice(currentIndex, charIndex) +
                        randomChar +
                        (i > 0 ? prev.slice(charIndex + 1) : '');
                      return scrambledText;
                    });
                  }, j * (speed / 3) + i * 50);

                  scrambleTimersRef.current.push(timer);
                }
              }
            }

            currentIndex++;
          } else {
            // Ensure the final text is set correctly
            setDisplayText(text);

            // Clear all scramble timers
            scrambleTimersRef.current.forEach((timer) => clearTimeout(timer));
            scrambleTimersRef.current = [];

            clearInterval(typingInterval);
            setIsTypingComplete(true);
            if (onComplete) onComplete();
          }
        }, speed);

        return () => clearInterval(typingInterval);
      }, delay);
    }

    return () => {
      if (startTimeout) clearTimeout(startTimeout);
    };
  }, [text, speed, delay, onComplete, scrambleIntensity]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className={`inline-flex ${className}`}>
      <span>{isTypingComplete ? finalTextRef.current : displayText}</span>
      <span
        className={`${
          showCursor && !isTypingComplete ? 'opacity-100' : 'opacity-0'
        } ml-1 border-r-4 border-current h-[1em] transition-opacity duration-100`}
      ></span>
    </div>
  );
};

export default AnimatedTitle;
