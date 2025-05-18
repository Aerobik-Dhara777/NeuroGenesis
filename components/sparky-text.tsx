"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function SparkyText() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const glitchBeforeRef = useRef<HTMLDivElement>(null)
  const glitchAfterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !textRef.current || !glitchBeforeRef.current || !glitchAfterRef.current) return

    // Set up continuous glitch animation
    const glitchTimeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 0, // No delay between iterations
    })

    // Function to generate random clip paths for the glitch effect
    const generateClipPath = () => {
      const top = Math.floor(Math.random() * 100)
      const bottom = Math.floor(Math.random() * 100)
      return `inset(${top}% 0 ${bottom}% 0)`
    }

    // Continuous micro-glitches
    for (let i = 0; i < 10; i++) {
      // Animate glitch before element (pink shadow)
      glitchTimeline.to(
        glitchBeforeRef.current,
        {
          clipPath: generateClipPath,
          left: () => `${Math.random() * 6 - 3}px`,
          duration: 0.1,
          ease: "none",
        },
        i * 0.1,
      )

      // Animate glitch after element (cyan shadow)
      glitchTimeline.to(
        glitchAfterRef.current,
        {
          clipPath: generateClipPath,
          left: () => `${Math.random() * 6 - 3}px`,
          duration: 0.1,
          ease: "none",
        },
        i * 0.1,
      )

      // Occasionally shift the main text slightly
      if (i % 3 === 0) {
        glitchTimeline.to(
          textRef.current,
          {
            x: () => `${Math.random() * 3 - 1.5}px`,
            duration: 0.1,
            ease: "none",
          },
          i * 0.1,
        )
      }
    }

    // Intense glitch sequence
    glitchTimeline.add("intense", "+=0.2")

    for (let i = 0; i < 15; i++) {
      // More dramatic glitches
      glitchTimeline.to(
        glitchBeforeRef.current,
        {
          clipPath: generateClipPath,
          left: () => `${Math.random() * 10 - 5}px`,
          duration: 0.05,
          ease: "none",
        },
        `intense+=${i * 0.05}`,
      )

      glitchTimeline.to(
        glitchAfterRef.current,
        {
          clipPath: generateClipPath,
          left: () => `${Math.random() * 10 - 5}px`,
          duration: 0.05,
          ease: "none",
        },
        `intense+=${i * 0.05}`,
      )

      glitchTimeline.to(
        textRef.current,
        {
          x: () => `${Math.random() * 4 - 2}px`,
          opacity: () => 0.8 + Math.random() * 0.2,
          duration: 0.05,
          ease: "none",
        },
        `intense+=${i * 0.05}`,
      )
    }

    // Return to subtle glitches without completely stopping
    glitchTimeline.add("subtle", "+=0.2")

    for (let i = 0; i < 8; i++) {
      glitchTimeline.to(
        [glitchBeforeRef.current, glitchAfterRef.current],
        {
          clipPath: generateClipPath,
          left: () => `${Math.random() * 4 - 2}px`,
          duration: 0.1,
          ease: "none",
        },
        `subtle+=${i * 0.1}`,
      )
    }

    return () => {
      glitchTimeline.kill()
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-40 flex items-center justify-center overflow-hidden">
      <h1
        ref={textRef}
        className="text-6xl md:text-8xl font-bold text-white tracking-tight font-mono relative"
        data-text="NeuroSpark1"
      >
        NeuroSpark1
        <div
          ref={glitchBeforeRef}
          className="absolute inset-0 text-6xl md:text-8xl font-bold tracking-tight font-mono left-[2px] text-transparent"
          style={{
            textShadow: "-2px 0 var(--neon-pink)",
            clipPath: "inset(0% 0 0% 0)",
          }}
          aria-hidden="true"
        >
          NeuroSpark1
        </div>
        <div
          ref={glitchAfterRef}
          className="absolute inset-0 text-6xl md:text-8xl font-bold tracking-tight font-mono left-[-2px] text-transparent"
          style={{
            textShadow: "2px 0 var(--neon-blue)",
            clipPath: "inset(0% 0 0% 0)",
          }}
          aria-hidden="true"
        >
          NeuroSpark1
        </div>
      </h1>
    </div>
  )
}
