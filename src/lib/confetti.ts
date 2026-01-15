import confetti from "canvas-confetti";

export const celebrateGoalReached = () => {
  // Fire confetti from left and right
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Burst from left
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    origin: { x: 0.2, y: 0.7 },
  });

  fire(0.2, {
    spread: 60,
    origin: { x: 0.2, y: 0.7 },
  });

  // Burst from right
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    origin: { x: 0.8, y: 0.7 },
  });

  fire(0.2, {
    spread: 60,
    origin: { x: 0.8, y: 0.7 },
  });

  // Center celebration
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    origin: { x: 0.5, y: 0.6 },
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    origin: { x: 0.5, y: 0.6 },
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.6 },
  });
};

export const celebrateChallengeComplete = () => {
  // Star-shaped confetti burst
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Stars and circles
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ["#FFD700", "#FFA500", "#FF6347", "#9370DB", "#00CED1"],
      shapes: ["star", "circle"],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ["#FFD700", "#FFA500", "#FF6347", "#9370DB", "#00CED1"],
      shapes: ["star", "circle"],
    });
  }, 250);
};
