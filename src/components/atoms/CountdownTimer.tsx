/**
 * Countdown Timer Component
 * 
 * Displays a large, prominent digital countdown timer with mobile-first responsive design.
 * Used on the interstitial page to show remaining time before redirect.
 * 
 * @module src/components/atoms/CountdownTimer
 */

"use client";

import React, { useState, useEffect } from "react";
import { CountdownTimerProps } from "@/interfaces/interstitial";

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialTime,
  onComplete,
  className = "",
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    // Don't start countdown if time is already 0
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    // Set up interval to decrease time every second
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;

        // Call onComplete when countdown reaches 0
        if (newTime <= 0) {
          clearInterval(intervalId);
          onComplete();
          return 0;
        }

        return newTime;
      });
    }, 1000);

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [timeLeft, onComplete]);

  /**
   * Format time as MM:SS
   */
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className={`countdown-timer flex flex-col items-center justify-center ${className}`}
      role="timer"
      aria-label={`Redirecting in ${timeLeft} seconds`}
    >
      {/* Large digital display */}
      <div className="text-8xl md:text-9xl font-bold text-black tracking-wider font-mono">
        {formatTime(timeLeft)}
      </div>

      {/* Helper text */}
      <p className="mt-4 text-lg md:text-xl text-gray-600 text-center">
        Redirecting in {timeLeft} {timeLeft === 1 ? "second" : "seconds"}...
      </p>

      {/* Progress indicator */}
      <div className="w-full max-w-md mt-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-black h-2 rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${((initialTime - timeLeft) / initialTime) * 100}%`,
            }}
            role="progressbar"
            aria-valuenow={initialTime - timeLeft}
            aria-valuemin={0}
            aria-valuemax={initialTime}
          />
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;

