"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { ChevronDown } from "lucide-react"
import ThreeTextEffect from "../components/three-text-effect"

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText)

    const ctx = gsap.context(() => {
      // Create a timeline for hero animations
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // Animate the hero background
      tl.fromTo(".hero-bg-gradient", { opacity: 0 }, { opacity: 1, duration: 2 })

      // Animate the tagline
      if (taglineRef.current) {
        const splitTagline = new SplitText(taglineRef.current, { type: "words" })

        tl.fromTo(
          splitTagline.words,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.8,
          },
          "+=1",
        )
      }

      // Animate the CTA button
      tl.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")

      // Animate the scroll indicator
      tl.fromTo(".scroll-indicator", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")

      // Add scroll animation to the scroll indicator
      gsap.to(".scroll-arrow", {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "power1.inOut",
      })

      // Parallax effect on hero section
      gsap.to(".hero-parallax", {
        y: 200,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })

      // Animate the hologram scan effect
      gsap.to(".hologram-scan", {
        y: "100%",
        repeat: -1,
        duration: 2,
        ease: "none",
      })

      // Animate the floating elements
      gsap.to(".floating-element", {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        rotation: "random(-15, 15)",
        duration: "random(3, 6)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
      })

      // Animate the data stream
      const dataStreamAnimation = () => {
        const dataElements = document.querySelectorAll(".data-stream-element")
        dataElements.forEach((element) => {
          gsap.fromTo(
            element,
            { opacity: 0, y: -20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              onComplete: () => {
                gsap.to(element, {
                  opacity: 0,
                  y: 20,
                  duration: 0.5,
                  delay: 1,
                })
              },
            },
          )
        })
      }

      // Start data stream animation and repeat
      dataStreamAnimation()
      setInterval(dataStreamAnimation, 2000)
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="hero-bg-gradient absolute inset-0 bg-gradient-to-b from-black via-blue-950/30 to-black z-0"></div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="floating-element absolute top-1/4 left-1/4 w-32 h-32 rounded-full border border-cyan-500/30 opacity-30"></div>
        <div className="floating-element absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full border border-purple-500/30 opacity-30"></div>
        <div className="floating-element absolute top-1/3 right-1/3 w-24 h-24 rounded-full border border-blue-500/30 opacity-30"></div>
        <div className="floating-element absolute bottom-1/3 left-1/3 w-40 h-40 rounded-full border border-cyan-500/30 opacity-30"></div>
      </div>

      <div className="hero-parallax absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border border-blue-500/20 opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full border border-purple-500/20 opacity-20"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full border border-cyan-500/20 opacity-20"></div>
      </div>

      {/* Hologram effect */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <div className="absolute inset-x-0 top-1/4 bottom-1/4 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-50"></div>
        <div className="absolute inset-y-0 left-1/4 right-1/4 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent opacity-50"></div>

        {/* Scanning effect */}
        <div className="hologram-scan absolute inset-x-0 h-px bg-cyan-400/50 top-0 shadow-[0_0_10px_rgba(0,255,255,0.7)]"></div>

        {/* Grid lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`grid-h-${i}`}
            className="absolute left-0 right-0 h-px bg-cyan-500/10"
            style={{ top: `${(i + 1) * 5}%` }}
          ></div>
        ))}

        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`grid-v-${i}`}
            className="absolute top-0 bottom-0 w-px bg-cyan-500/10"
            style={{ left: `${(i + 1) * 5}%` }}
          ></div>
        ))}
      </div>

      {/* Data stream */}
      <div className="absolute right-10 top-1/4 bottom-1/4 w-20 flex flex-col items-center justify-center overflow-hidden pointer-events-none z-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={`data-${i}`} className="data-stream-element text-cyan-500/70 text-xs font-mono my-1 opacity-0">
            {Math.random().toString(36).substring(2, 8)}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 text-center z-10">
        {/* 3D Text Effect */}
        <div className="h-32 mb-6 relative">
          <ThreeTextEffect />
        </div>

        <p ref={taglineRef} className="text-xl md:text-2xl text-cyan-100 mb-12 max-w-2xl mx-auto mt-24">
          Shaping Future Tech – One Spark at a Time
        </p>

        <div ref={ctaRef} className="mb-16">
          <button
            className="px-8 py-4 bg-transparent border-2 border-cyan-500 text-cyan-400 rounded-full hover:bg-cyan-500/10 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,255,0.3)] relative overflow-hidden group cursor-hover"
            data-cursor-text="Explore"
          >
            <span className="relative z-10 font-medium">Explore Our Work</span>
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          </button>
        </div>

        <div className="scroll-indicator absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <p className="text-cyan-400/70 text-sm mb-2">Scroll to explore</p>
          <div className="scroll-arrow text-cyan-400">
            <ChevronDown size={24} />
          </div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-cyan-500/30"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-cyan-500/30"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-cyan-500/30"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-cyan-500/30"></div>
    </section>
  )
}
