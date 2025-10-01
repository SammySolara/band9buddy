// src/components/common/AnimatedBackground.js
import { useEffect, useRef } from "react";

const AnimatedBackground = ({ children }) => {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;

    // Check if user is on desktop
    const isDesktop = window.innerWidth > 768 && !("ontouchstart" in window);

    if (!isDesktop) {
      if (cursor) cursor.style.display = "none";
      return;
    }

    // Hide default cursor
    document.body.style.cursor = "none";

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    // Cursor follow effect with delayed ring
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursor) {
        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";
      }
    };

    // Smooth ring following with delay
    const animateRing = () => {
      if (ring) {
        const speed = 0.15; // Lower = more delay
        ringX += (mouseX - ringX) * speed;
        ringY += (mouseY - ringY) * speed;

        ring.style.left = ringX + "px";
        ring.style.top = ringY + "px";
      }
      requestAnimationFrame(animateRing);
    };
    animateRing();

    // Cursor interaction effects
    const handleMouseOver = (e) => {
      if (!e.target || !cursor) return;

      // Check if target is an interactive element or inside one
      const isInteractive =
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "INPUT" ||
        e.target.tagName === "A" ||
        (e.target.closest &&
          (e.target.closest("button") ||
            e.target.closest("input") ||
            e.target.closest("a"))) ||
        e.target.classList?.contains("cursor-pointer") ||
        getComputedStyle(e.target).cursor === "pointer";

      if (isInteractive) {
        cursor.classList.add("cursor-hover");
      } else {
        cursor.classList.remove("cursor-hover");
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.body.style.cursor = "auto"; // Restore default cursor
    };
  }, []);

  useEffect(() => {
    // Create floating dots
    const createDot = () => {
      if (!containerRef.current) return;

      const dot = document.createElement("div");

      // Random properties
      const size = Math.random() * 3 + 1.5;
      const opacity = Math.random() * 0.5 + 0.3;
      const duration = Math.random() * 12 + 8;
      const delay = Math.random() * 2;
      const startX = Math.random() * 100;
      const driftX = Math.random() * 40 - 20; // -20 to +20

      dot.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, ${opacity});
        box-shadow: 0 0 6px rgba(255,255,255,${opacity});
        border-radius: 50%;
        pointer-events: none;
        left: ${startX}%;
        bottom: -10px;
        z-index: 1;
      `;

      // Add to DOM
      containerRef.current.appendChild(dot);
      dotsRef.current.push(dot);

      // Animate the dot
      let progress = 0;
      const animate = () => {
        progress += 1 / (duration * 60); // 60fps assumption

        if (progress >= 1) {
          // Remove dot when animation completes
          if (dot.parentNode) {
            dot.parentNode.removeChild(dot);
          }
          dotsRef.current = dotsRef.current.filter((d) => d !== dot);
          return;
        }

        // Smooth easing function
        const easeProgress =
          progress < 0.1
            ? progress * 10
            : progress > 0.9
            ? 1 - (1 - progress) * 10
            : 1;

        const y = -window.innerHeight * 1.2 * progress;
        const x = driftX * progress;
        const scale = easeProgress;
        const currentOpacity = opacity * easeProgress;

        dot.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        dot.style.opacity = currentOpacity;

        requestAnimationFrame(animate);
      };

      // Start animation after delay
      setTimeout(() => {
        if (dot.parentNode) {
          requestAnimationFrame(animate);
        }
      }, delay * 1000);
    };

    // Create dots periodically
    const interval = setInterval(() => {
      if (containerRef.current && dotsRef.current.length < 50) {
        createDot();
      }
    }, 100);

    // Create initial dots
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        if (containerRef.current) {
          createDot();
        }
      }, i * 150);
    }

    return () => {
      clearInterval(interval);
      // Clean up all dots
      dotsRef.current.forEach((dot) => {
        if (dot.parentNode) {
          dot.parentNode.removeChild(dot);
        }
      });
      dotsRef.current = [];
    };
  }, []);

  return (
    <div ref={containerRef} className="animated-background">
      {/* Dark overlay to make content pop */}
      <div className="background-overlay"></div>

      {/* Futuristic Crosshair Cursor */}
      <div ref={cursorRef} className="custom-cursor">
        {/* Center dot - follows immediately */}
        <div className="cursor-center"></div>
      </div>

      {/* Outer ring - follows with delay */}
      <div ref={ringRef} className="cursor-ring-container">
        <div className="cursor-ring"></div>
      </div>

      {children}

      <style jsx>{`
        .animated-background {
          position: relative;
          overflow: hidden;
          cursor: none !important;
        }

        .animated-background * {
          cursor: none !important;
        }

        .background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(1px);
          z-index: 0;
          pointer-events: none;
        }

        .custom-cursor {
          position: fixed;
          width: 8px;
          height: 8px;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: all 0.15s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .cursor-ring-container {
          position: fixed;
          width: 40px;
          height: 40px;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
        }

        .cursor-center {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          background: #00ffff;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 8px #00ffff, 0 0 16px #00ffff;
          transition: all 0.2s ease;
        }

        .cursor-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 32px;
          height: 32px;
          border: 1px solid rgba(0, 255, 255, 0.6);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 12px rgba(0, 255, 255, 0.3);
          transition: all 0.2s ease;
        }

        .custom-cursor.cursor-hover .cursor-center {
          background: #ff00ff;
          box-shadow: 0 0 12px #ff00ff, 0 0 24px #ff00ff;
          transform: translate(-50%, -50%) scale(1.5);
        }

        .cursor-ring-container .cursor-ring {
          border-color: rgba(255, 0, 255, 0.8);
          box-shadow: 0 0 16px rgba(255, 0, 255, 0.4);
          transform: translate(-50%, -50%) scale(1.2);
        }

        @media (max-width: 768px) {
          .animated-background,
          .animated-background * {
            cursor: auto !important;
          }

          .custom-cursor,
          .cursor-ring-container {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
