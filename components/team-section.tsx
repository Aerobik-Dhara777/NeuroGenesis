"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TextPlugin } from "gsap/TextPlugin"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger, TextPlugin) // Register plugins

// Team member data
const teamMembers = [
  {
    id: 1,
    name: "Soumadip",
    role: "Full Stack Developer",
    bio: "Passionate about creating seamless web experiences with cutting-edge technologies. Specializes in React, Node.js, and modern web frameworks.",
    image: "/placeholder.svg?height=400&width=400",
    skills: ["React", "Node.js", "TypeScript", "Next.js" , "api handeling"],
  },
  {
    id: 2,
    name: "sweet heart",
    role: "Spring Boot Expert",
    bio: "Enterprise application specialist with deep knowledge of Java and Spring Boot. Creates robust backend systems that power mission-critical applications.",
    image: "/placeholder.svg?height=400&width=400",
    skills: ["Java", "Spring Boot", "Microservices", "SQL"],
  },
  {
    id: 3,
    name: "Souvik",
    role: "Hardware Specialist",
    bio: "Bridging the gap between software and hardware. Expert in embedded systems, IoT solutions, and hardware integration for next-gen applications.",
    image: "/placeholder.svg?height=400&width=400",
    skills: ["IoT", "Embedded Systems", "PCB Design", "Arduino"],
  },
  {
    id: 4,
    name: "Soumaditya",
    role: "Backend Developer",
    bio: "Database architecture and API design expert. Creates scalable backend solutions that handle millions of requests with optimal performance.",
    image: "/placeholder.svg?height=400&width=400",
    skills: ["Python", "Django", "MongoDB", "AWS"],
  },
  {
    id: 5,
    name: "Iron Man",
    role: "AI Developer",
    bio: "Pushing the boundaries of artificial intelligence. Develops machine learning models and neural networks for innovative applications.",
    image: "/placeholder.svg?height=400&width=400",
    skills: ["TensorFlow", "PyTorch", "Computer Vision", "NLP"],
  },
  {
    id: 6,
    name: "Moxa Kobita",
    role: "Physics Graphics Designer",
    bio: "Combines artistic vision with technical expertise. Creates stunning visual experiences with physics-based animations and simulations.",
    image: "/placeholder.svg?height=400&width=400",
    skills: ["Three.js", "WebGL", "Blender", "GSAP"],
  },

]

export default function TeamSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const headingTextRef = useRef<HTMLSpanElement>(null)
  const headingAccentRef = useRef<HTMLSpanElement>(null)
  const teamContainerRef = useRef<HTMLDivElement>(null)
  const teamCardsRef = useRef<HTMLDivElement[]>([])
  const descriptionRef = useRef<HTMLParagraphElement>(null) // New ref for the paragraph

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the heading
      if (headingRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            onEnter: () => tl.restart(),
            onEnterBack: () => tl.restart(),
          },
        })

        if (headingTextRef.current) {
          const meetTheText = headingTextRef.current.textContent || ""
          headingTextRef.current.innerHTML = ""

          meetTheText.split("").forEach((char) => {
            const charSpan = document.createElement("span")
            charSpan.textContent = char === " " ? "\u00A0" : char
            charSpan.style.display = "inline-block"
            charSpan.style.opacity = "0"
            charSpan.style.transform = "translateY(50px)"
            headingTextRef.current!.appendChild(charSpan)
          })

          tl.to(headingTextRef.current.children, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "back.out(1.7)",
          })
        }

        if (headingAccentRef.current) {
          const teamText = headingAccentRef.current.textContent || ""
          headingAccentRef.current.innerHTML = ""

          teamText.split("").forEach((char) => {
            const charSpan = document.createElement("span")
            charSpan.textContent = char
            charSpan.style.display = "inline-block"
            charSpan.style.opacity = "0"
            charSpan.style.transform = "translateY(50px)"
            headingAccentRef.current!.appendChild(charSpan)
          })

          tl.to(
            headingAccentRef.current.children,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.05,
              ease: "back.out(1.7)",
            },
            "-=0.3",
          )
        }
      }

      // ✨ Scramble Text Animation for the paragraph
      if (descriptionRef.current) {
        const originalText =
          "Our multidisciplinary team combines expertise across various domains to create innovative solutions that push the boundaries of technology."

        gsap.fromTo(
          descriptionRef.current,
          { text: "" },
          {
            text: originalText,
            duration:4,
            ease: "power2.out",
            scrambleText: {
              text: originalText,
              chars: "0X&7#",
              revealDelay: 1,
              speed: 0.7,
            },
            scrollTrigger: {
              trigger: descriptionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }

      // Horizontal scroll for team members
      if (sectionRef.current && teamContainerRef.current) {
        gsap.set(teamCardsRef.current, { x: "100%" })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: 1,
          },
        })

        const totalWidth = teamCardsRef.current.reduce((acc, card) => acc + card.offsetWidth + 20, 0)
        const containerWidth = teamContainerRef.current.offsetWidth
        const distance = totalWidth - containerWidth

        tl.to(teamContainerRef.current, {
          x: -distance,
          ease: "none",
          duration: 1,
        })
      }

      // Decorative elements
      gsap.fromTo(
        ".team-decoration",
        { opacity: 0, scale: 0.5 },
        {
          opacity: 0.7,
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const setTeamCardRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      teamCardsRef.current[index] = el
    }
  }

  return (
    <section id="team" ref={sectionRef} className="py-20 bg-black relative overflow-hidden min-h-screen">
      {/* Decorative elements */}
      <div className="team-decoration absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
      <div className="team-decoration absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
      <div className="team-decoration absolute -top-20 -left-20 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl"></div>
      <div className="team-decoration absolute -bottom-40 -right-20 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>

      <div className="container mx-auto px-4">
        <h2 ref={headingRef} className="text-4xl md:text-6xl font-bold text-center mb-6">
          <span ref={headingTextRef} className="text-white">
            Meet the
          </span>{" "}
          <span ref={headingAccentRef} className="text-cyan-400 neon-glow-text">
            Team
          </span>
        </h2>

        {/* ✅ Scramble animated paragraph */}
        <p
          ref={descriptionRef}
          className="section-description text-center text-gray-300 max-w-3xl mx-auto mb-16"
        >
          Our multidisciplinary team combines expertise across various domains to create innovative solutions that push
          the boundaries of technology.
        </p>

        <div className="overflow-hidden">
          <div ref={teamContainerRef} className="flex space-x-8 pb-8">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                ref={(el) => setTeamCardRef(el as HTMLDivElement, index)}
                className="team-card flex-shrink-0 w-[450px] bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl p-6 border border-cyan-500/20 shadow-lg overflow-hidden"
              >
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 relative rounded-full overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.2)] mb-4">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10"></div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-cyan-400 text-sm mb-4 font-medium">{member.role}</p>
                  <p className="text-gray-300 text-sm mb-4 text-center">{member.bio}</p>

                  <div className="w-full">
                    <h4 className="text-white text-sm font-medium mb-2">Skills:</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-cyan-950/50 text-cyan-400 rounded-full border border-cyan-500/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  
    </section>
  )
}
