"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function FuturisticCursor() {
  const cursorOuterRef = useRef<HTMLDivElement>(null)
  const cursorInnerRef = useRef<HTMLDivElement>(null)
  const cursorGlowRef = useRef<HTMLDivElement>(null)
  const cursorTextRef = useRef<HTMLDivElement>(null)
  const isHovering = useRef(false)
  const hoverElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Main cursor
      if (cursorOuterRef.current && cursorInnerRef.current && cursorGlowRef.current) {
        gsap.to(cursorOuterRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
          ease: "power2.out",
        })

        gsap.to(cursorInnerRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: "power2.out",
        })

        gsap.to(cursorGlowRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.6,
          ease: "power2.out",
        })
      }
    }

    const handleMouseDown = () => {
      // Scale down on click
      if (cursorOuterRef.current && cursorInnerRef.current && cursorGlowRef.current) {
        gsap.to(cursorOuterRef.current, {
          scale: 0.8,
          duration: 0.2,
        })
        gsap.to(cursorInnerRef.current, {
          scale: 0.6,
          duration: 0.2,
        })
        gsap.to(cursorGlowRef.current, {
          scale: 0.7,
          opacity: 0.7,
          duration: 0.2,
        })
      }
    }

    const handleMouseUp = () => {
      // Scale back up on release
      if (cursorOuterRef.current && cursorInnerRef.current && cursorGlowRef.current) {
        gsap.to(cursorOuterRef.current, {
          scale: 1,
          duration: 0.2,
        })
        gsap.to(cursorInnerRef.current, {
          scale: 1,
          duration: 0.2,
        })
        gsap.to(cursorGlowRef.current, {
          scale: 1,
          opacity: 0.5,
          duration: 0.2,
        })
      }
    }

    // Handle hover states
    const handleElementMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      if (target.tagName === "A" || target.tagName === "BUTTON" || target.classList.contains("cursor-hover")) {
        isHovering.current = true
        hoverElement.current = target

        if (cursorOuterRef.current && cursorInnerRef.current && cursorGlowRef.current && cursorTextRef.current) {
          gsap.to(cursorOuterRef.current, {
            scale: 1.5,
            borderColor: "#00ffff",
            duration: 0.3,
          })

          gsap.to(cursorInnerRef.current, {
            scale: 0.5,
            backgroundColor: "#00ffff",
            duration: 0.3,
          })

          gsap.to(cursorGlowRef.current, {
            scale: 1.8,
            backgroundColor: "rgba(0, 255, 255, 0.15)",
            duration: 0.3,
          })

          cursorTextRef.current.textContent = target.getAttribute("data-cursor-text") || "Click"
          gsap.to(cursorTextRef.current, {
            opacity: 1,
            duration: 0.3,
          })
        }
      }
    }

    const handleElementMouseLeave = () => {
      isHovering.current = false
      hoverElement.current = null

      if (cursorOuterRef.current && cursorInnerRef.current && cursorGlowRef.current && cursorTextRef.current) {
        gsap.to(cursorOuterRef.current, {
          scale: 1,
          borderColor: "rgba(0, 255, 255, 0.7)",
          duration: 0.3,
        })

        gsap.to(cursorInnerRef.current, {
          scale: 1,
          backgroundColor: "#00ffff",
          duration: 0.3,
        })

        gsap.to(cursorGlowRef.current, {
          scale: 1,
          backgroundColor: "rgba(0, 255, 255, 0.1)",
          duration: 0.3,
        })

        gsap.to(cursorTextRef.current, {
          opacity: 0,
          duration: 0.3,
        })
      }
    }

    // Pulse animation for cursor
    if (cursorOuterRef.current && cursorGlowRef.current) {
      gsap.to(cursorOuterRef.current, {
        boxShadow: "0 0 15px rgba(0, 255, 255, 0.7)",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
      })

      gsap.to(cursorGlowRef.current, {
        opacity: 0.3,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
      })
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseover", handleElementMouseEnter)
    document.addEventListener("mouseout", handleElementMouseLeave)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseover", handleElementMouseEnter)
      document.removeEventListener("mouseout", handleElementMouseLeave)
    }
  }, [])

  return (
    <div className="hidden lg:block">
      <div
        ref={cursorGlowRef}
        className="fixed w-16 h-16 rounded-full bg-cyan-400/10 pointer-events-none z-50 translate-x-[-50%] translate-y-[-50%]"
      ></div>
      <div
        ref={cursorOuterRef}
        className="fixed w-8 h-8 rounded-full border-2 border-cyan-400/70 pointer-events-none z-50 translate-x-[-50%] translate-y-[-50%]"
      ></div>
      <div
        ref={cursorInnerRef}
        className="fixed w-2 h-2 rounded-full bg-cyan-400 pointer-events-none z-50 translate-x-[-50%] translate-y-[-50%]"
      ></div>
      <div
        ref={cursorTextRef}
        className="fixed text-xs text-white font-mono pointer-events-none z-50 opacity-0 translate-x-[-50%] translate-y-[10px]"
      ></div>
    </div>
  )
}
