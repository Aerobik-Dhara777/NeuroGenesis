"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [, setCounter] = useState(0)

  useEffect(() => {
    if (!containerRef.current || !counterRef.current || !progressBarRef.current) return

    // Create a timeline for the loading animation
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out the loading screen
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            // Call the onComplete callback to show the main content
            onComplete()
          },
        })
      },
    })

    // Animate the counter from 0 to 100
    tl.to(counterRef.current, {
      innerText: 100,
      duration: 3,
      snap: { innerText: 1 }, // Snap to integer values
      ease: "power2.inOut",
      onUpdate: () => {
        // Update the React state for the counter
        if (counterRef.current) {
          setCounter(Math.round(Number(counterRef.current.innerText)))
        }
      },
    })

    // Animate the progress bar
    tl.to(
      progressBarRef.current,
      {
        width: "100%",
        duration: 3,
        ease: "power2.inOut",
      },
      0,
    ) // Start at the same time as the counter

    // Animate the glitch effect on the text
    const glitchText = () => {
      const elements = document.querySelectorAll(".loading-glitch")
      elements.forEach((el) => {
        const originalText = el.textContent || ""
        const chars = "!@#$%^&*()_+1234567890qwertyuiopasdfghjklzxcvbnm"
        let iterations = 0

        const interval = setInterval(() => {
          if (iterations >= 10) {
            clearInterval(interval)
            el.textContent = originalText
            return
          }

          el.textContent = originalText
            .split("")
            .map((char, idx) => {
              if (idx < iterations) return originalText[idx]
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join("")

          iterations += 1 / 3
        }, 50)
      })
    }

    // Trigger glitch effect at specific points
    tl.call(glitchText, [], 1)
    tl.call(glitchText, [], 2)
    tl.call(glitchText, [], 2.5)

    return () => {
      tl.kill()
    }
  }, [onComplete])

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <div className="w-full max-w-4xl px-8 relative">
        <h1 className="text-7xl md:text-9xl font-bold text-white mb-8 loading-glitch">NeuroSpark1</h1>

        <p className="text-gray-400 text-xl mb-4">Initializing neural interface...</p>

        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mb-8">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 w-0"
          ></div>
        </div>

        {/* Large counter in the right corner */}
        <div
            ref={counterRef}
            className="absolute right-0 text-8xl md:text-9xl font-bold text-cyan-500/80"
            style={{
              bottom: "-40px", // Push it further below the container
              textShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
            }}
          >
            0
          </div>


      </div>
    </div>
  )
}
