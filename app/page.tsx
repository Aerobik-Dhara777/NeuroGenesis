"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TextPlugin } from "gsap/TextPlugin"
import { ChevronDown } from "lucide-react"
import Navbar from "../components/navbar"
import TeamSection from "../components/team-section"
import ProjectsSection from "../components/projects-section"
import VisionSection from "../components/vision-section"
import ContactSection from "../components/contact-section"
import SparkyText from "../components/sparky-text"
import FuturisticCursor from "../components/futuristic-cursor"
import LoadingScreen from "../components/loading-screen"
import InteractiveBackground from "../components/interactive-background"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const mainRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, TextPlugin)

    if (!loading) {
      const ctx = gsap.context(() => {
        // Scramble text animation for the tagline with repeat
        if (taglineRef.current) {
          const originalText = taglineRef.current.textContent || ""

          // Hide the text initially
          gsap.set(taglineRef.current, { opacity: 0 })

          // Start the scramble animation after a delay
          gsap.to(taglineRef.current, {
            delay: 0.5,
            duration: 0.1,
            opacity: 1,
            onComplete: () => {
              // Function to create the scramble effect
              const createScrambleEffect = () => {
                
                const chars = "!@#$%0X7"
                const finalText = originalText
                const duration = 2
                const steps = 20
                let step = 0

                const scrambleInterval = setInterval(
                  () => {
                    if (step >= steps) {
                      clearInterval(scrambleInterval)
                      taglineRef.current!.textContent = finalText
                      return
                    }

                    let scrambledText = ""
                    for (let i = 0; i < finalText.length; i++) {
                      // Characters that have been "locked in"
                      if (i < Math.floor((step / steps) * finalText.length)) {
                        scrambledText += finalText[i]
                      } else {
                        // Random characters for the rest
                        scrambledText += chars[Math.floor(Math.random() * chars.length)]
                      }
                    }

                    taglineRef.current!.textContent = scrambledText
                    step++
                  },
                  (duration * 1000) / steps,
                )
              }

              // Initial scramble effect
              createScrambleEffect()

              // Repeat the scramble effect every 10 seconds
              setInterval(() => {
                // First scramble the text to random characters
                const chars = "!@#$%^&*()_+1234567890qwertyuiopasdfghjklzxcvbnm"
                let scrambledText = ""
                for (let i = 0; i < originalText.length; i++) {
                  scrambledText += chars[Math.floor(Math.random() * chars.length)]
                }
                taglineRef.current!.textContent = scrambledText

                // Then run the scramble effect to reveal the original text
                setTimeout(createScrambleEffect, 300)
              }, 10000)
            },
          })
        }

        // Animate the CTA button
        gsap.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 2.5 })

        // Animate the scroll indicator
        gsap.fromTo(".scroll-indicator", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, delay: 3 })

        // Add scroll animation to the scroll arrow
        gsap.to(".scroll-arrow", {
          y: 10,
          repeat: -1,
          yoyo: true,
          duration: 1,
          ease: "power1.inOut",
        })

        // Animate section transitions
        const sections = gsap.utils.toArray("section")
        sections.forEach((section, i) => {
          ScrollTrigger.create({
            trigger: section as Element,
            start: "top 80%",
            onEnter: () => {
              gsap.to(".section-indicator", {
                y: i * 30,
                duration: 0.5,
                ease: "power2.inOut",
              })
            },
            onEnterBack: () => {
              gsap.to(".section-indicator", {
                y: i * 30,
                duration: 0.5,
                ease: "power2.inOut",
              })
            },
          })
        })
      }, mainRef)

      return () => {
        // Cleanup all ScrollTriggers when component unmounts
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
        ctx.revert()
      }
    }
  }, [loading])

  // Handle loading completion
  const handleLoadingComplete = () => {
    setLoading(false)
  }

  return (
    <>
      {loading ? (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) : (
        <main ref={mainRef} className="relative overflow-hidden">
          {/* Background elements */}
          <div className="fixed inset-0 bg-black z-[-2]"></div>

          {/* Interactive Background */}
          <InteractiveBackground />

          {/* Custom cursor */}
          <FuturisticCursor />

          {/* Section indicator */}
          <div className="section-indicator fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
            <div className="w-2 h-2 rounded-full bg-white mb-7 relative">
              <span className="absolute left-4 text-xs text-white/70">Home</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-white/50 mb-7 relative">
              <span className="absolute left-4 text-xs text-white/50">Team</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-white/50 mb-7 relative">
              <span className="absolute left-4 text-xs text-white/50">Projects</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-white/50 mb-7 relative">
              <span className="absolute left-4 text-xs text-white/50">Vision</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-white/50 relative">
              <span className="absolute left-4 text-xs text-white/50">Contact</span>
            </div>
          </div>

          {/* Navbar */}
          <Navbar />

          {/* Hero Section */}
          <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
            <div className="container mx-auto px-4 text-center z-10">
              <SparkyText />

              <p ref={taglineRef} className="text-xl md:text-2xl text-cyan-100 mb-12 max-w-2xl mx-auto mt-8">
                Shaping Future Tech – One Spark at a Time
              </p>

              <div ref={ctaRef} className="mb-16">
                <button
                  className="px-8 py-4 bg-transparent border-2 border-cyan-500 text-cyan-400 rounded-full hover:bg-cyan-500/10 transition-all duration-300 neon-button relative overflow-hidden group cursor-hover"
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

          {/* Other sections */}
          <TeamSection />
          <ProjectsSection />
          <VisionSection />
          <ContactSection />
        </main>
      )}
    </>
  )
}
