"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"
import { Brain, Cpu, Database, Globe, Layers, Zap } from "lucide-react"

// Skills data
const skills = [
  { id: 1, name: "Web Development", level: 90, icon: <Globe size={20} /> },
  { id: 2, name: "AI & Machine Learning", level: 85, icon: <Brain size={20} /> },
  { id: 3, name: "Hardware Integration", level: 80, icon: <Cpu size={20} /> },
  { id: 4, name: "Backend Systems", level: 95, icon: <Database size={20} /> },
  { id: 5, name: "Graphics & Visualization", level: 88, icon: <Layers size={20} /> },
  { id: 6, name: "Cloud Architecture", level: 92, icon: <Zap size={20} /> },
]

export default function VisionSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const visionRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Animate the section heading
      gsap.fromTo(
        headingRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Animate the section description
      gsap.fromTo(
        ".vision-description",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.2,
          scrollTrigger: {
            trigger: ".vision-description",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Animate vision content
      gsap.fromTo(
        visionRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3,
          scrollTrigger: {
            trigger: visionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Animate skill bars
      const skillBars = gsap.utils.toArray(".skill-progress")

      skillBars.forEach((bar) => {
        const el = bar as Element
        const progress = el.getAttribute("data-progress")

        gsap.fromTo(
          el,
          { width: "0%" },
          {
            width: `${progress}%`,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        )
      })

      // Animate skill labels
      const skillLabels = gsap.utils.toArray(".skill-label")

      skillLabels.forEach((label, index) => {
        const el = label as Element
        gsap.fromTo(
          el,
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        )
      })

      // Animate skill percentages
      const skillPercentages = gsap.utils.toArray(".skill-percentage")

      skillPercentages.forEach((percentage, index) => {
        const el = percentage as Element
        gsap.fromTo(
          el,
          { x: 20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.5 + index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        )
      })

      // Animate the decorative elements
      gsap.fromTo(
        ".vision-decoration",
        { opacity: 0 },
        {
          opacity: 0.7,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Rotating skill dial animation
      gsap.to(".skill-dial", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="vision" ref={sectionRef} className="py-20 bg-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="vision-decoration absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
      <div className="vision-decoration absolute -top-40 -left-40 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
      <div className="vision-decoration absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl"></div>

      {/* Skill dial decoration */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-10">
        <div className="skill-dial absolute inset-0 border-2 border-dashed border-cyan-500 rounded-full"></div>
        <div className="skill-dial absolute inset-[50px] border border-purple-500 rounded-full"></div>
        <div className="skill-dial absolute inset-[100px] border border-cyan-500 rounded-full"></div>
        <div className="skill-dial absolute inset-[150px] border border-blue-500 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 ref={headingRef} className="text-4xl md:text-6xl font-bold text-center mb-6">
          <span className="text-white">Our</span> <span className="text-purple-400 neon-glow-text-purple">Vision</span>{" "}
          <span className="text-white">&</span> <span className="text-cyan-400 neon-glow-text-cyan">Skills</span>
        </h2>

        <p className="vision-description text-center text-gray-300 max-w-3xl mx-auto mb-16">
          We&apos;re committed to pushing the boundaries of what&apos;s possible, creating technologies that are not just
          cutting-edge today, but that will define the standards of tomorrow.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            ref={visionRef}
            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl p-8 border border-cyan-500/20 shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden"
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            {/* Background glow */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

            <h3 className="text-2xl font-bold mb-6 relative">
              <span className="text-white">Our</span>{" "}
              <span className="text-purple-400 neon-glow-text-purple">Vision</span>
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-cyan-500 to-purple-600"></div>
            </h3>

            <p className="text-gray-300 mb-4 relative z-10">
              At NeuroSpark1, we envision a future where technology seamlessly integrates with human potential, creating
              solutions that are not just innovative but transformative.
            </p>
            <p className="text-gray-300 mb-4 relative z-10">
              Our multidisciplinary team combines expertise across web development, AI, hardware integration, and visual
              design to create holistic solutions to complex problems.
            </p>
            <p className="text-gray-300 relative z-10">
              We&apos;re committed to pushing the boundaries of what&apos;s possible, creating technologies that are not just
              cutting-edge today, but that will define the standards of tomorrow.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                className="px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <h4 className="text-cyan-400 font-medium mb-1">Innovation</h4>
                <p className="text-gray-300 text-sm">Pioneering new approaches</p>
              </motion.div>
              <motion.div
                className="px-4 py-3 bg-purple-500/10 border border-purple-500/30 rounded-lg"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <h4 className="text-purple-400 font-medium mb-1">Collaboration</h4>
                <p className="text-gray-300 text-sm">Stronger together</p>
              </motion.div>
              <motion.div
                className="px-4 py-3 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <h4 className="text-blue-400 font-medium mb-1">Excellence</h4>
                <p className="text-gray-300 text-sm">Uncompromising quality</p>
              </motion.div>
            </div>

            {/* Animated corner accents */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-cyan-500/50"></div>
            <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-cyan-500/50"></div>
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-cyan-500/50"></div>
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-cyan-500/50"></div>
          </motion.div>

          <motion.div
            ref={skillsRef}
            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl p-8 border border-cyan-500/20 shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden"
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            {/* Background glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

            <h3 className="text-2xl font-bold mb-6 relative">
              <span className="text-white">Our</span> <span className="text-cyan-400 neon-glow-text-cyan">Skills</span>
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-cyan-500 to-purple-600"></div>
            </h3>

            <div className="space-y-6">
              {skills.map((skill) => (
                <div key={skill.id} className="skill-item">
                  <div className="flex justify-between mb-2 items-center">
                    <div className="skill-label flex items-center gap-2">
                      <span className="text-cyan-400">{skill.icon}</span>
                      <span className="text-gray-300">{skill.name}</span>
                    </div>
                    <span className="skill-percentage text-cyan-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="skill-progress h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
                      data-progress={skill.level}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Animated corner accents */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-cyan-500/50"></div>
            <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-cyan-500/50"></div>
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-cyan-500/50"></div>
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-cyan-500/50"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
