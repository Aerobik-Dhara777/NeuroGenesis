"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"


const projects = [
  {
    id: 1,
    title: "Neural Interface",
    description: "A cutting-edge brain-computer interface that translates neural signals into digital commands.",
    contributors: ["Soumadip", "Iron Man"],
    tags: ["AI", "Hardware", "Neural Networks"],
    image: "https://media.istockphoto.com/id/1446453624/photo/artificial-intelligenc-and-human-brain.jpg?b=1&s=612x612&w=0&k=20&c=eXiqGKnGXn_ldcS3-asNLa6Ph0fw2OKPzH3qMYput50=",
  },
  {
    id: 2,
    title: "Quantum Visualization",
    description: "Interactive visualization platform for quantum computing concepts and algorithms.",
    contributors: ["Moxa Kobita", "Soumaditya"],
    tags: ["Graphics", "Physics", "Education"],
    image: "https://images.unsplash.com/photo-1648614593495-e0955bf287e5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cXVhbnR1bSUyMHZpc3VhbGl6YXRpb24lMjBjb21wdXRlcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 3,
    title: "Enterprise Cloud Suite",
    description: "Scalable cloud infrastructure solution for enterprise applications with advanced security features.",
    contributors: ["Iron Man", "Souvik"],
    tags: ["Cloud", "Security", "Enterprise"],
    image: "https://images.pexels.com/photos/1292115/pexels-photo-1292115.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 4,
    title: "Augmented Reality Workspace",
    description: "Next-generation AR platform for collaborative remote work and design.",
    contributors: ["Soumaditya", "Ramnayan"],
    tags: ["AR", "Collaboration", "Design"],
    image: "https://images.unsplash.com/photo-1622879846596-2ad016c9b567?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d29ya3NoaG9wfGVufDB8fDB8fHww",
  },
  {
    id: 5,
    title: "Autonomous Systems Framework",
    description: "Framework for developing self-learning autonomous systems with real-time adaptation.",
    contributors: ["Swarup", "Souvik"],
    tags: ["AI", "Autonomous", "Robotics"],
    image: "https://images.unsplash.com/photo-1527612820672-5b56351f7346?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzl8fGF1dG9ub21vdXMlMjBzeXN0ZW0lMjBmcmFtZXdvcmt8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 6,
    title: "Distributed Database Solution",
    description: "High-performance distributed database with advanced query optimization.",
    contributors: ["Soumadip", "Sweet Heart"],
    tags: ["Database", "Performance", "Distributed"],
    image: "https://images.pexels.com/photos/4508751/pexels-photo-4508751.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
]

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const headingTextRef = useRef<HTMLSpanElement>(null)
  const headingAccentRef = useRef<HTMLSpanElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const projectCards = gsap.utils.toArray<HTMLElement>(".project-card")

      projectCards.forEach((card) => {
        const imageBox = card.querySelector(".image-box")
        const textBox = card.querySelector(".text-box")

        gsap.set(imageBox, {
          x: () => Math.random() * 300 * (Math.random() > 0.5 ? 1 : -1),
          y: () => Math.random() * 100 * (Math.random() > 0.5 ? 1 : -1),
          rotation: () => Math.random() * 20 * (Math.random() > 0.5 ? 1 : -1),
          opacity: 0,
        })

        gsap.set(textBox, {
          x: () => Math.random() * 300 * (Math.random() > 0.5 ? 1 : -1),
          y: () => Math.random() * 100 * (Math.random() > 0.5 ? 1 : -1),
          rotation: () => Math.random() * 20 * (Math.random() > 0.5 ? 1 : -1),
          opacity: 0,
        })

        gsap.to(imageBox, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 1.2,
          ease: "elastic.out(1, 0.8)",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })

        gsap.to(textBox, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 1.2,
          delay: 0.1,
          ease: "elastic.out(1, 0.8)",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
      })

      if (headingTextRef.current && headingAccentRef.current) {
        const ourText = headingTextRef.current.textContent || ""
        headingTextRef.current.innerHTML = ""

        ourText.split("").forEach((char, index) => {
          const charSpan = document.createElement("span")
          charSpan.textContent = char
          charSpan.style.display = "inline-block"
          charSpan.style.opacity = "0"
          charSpan.style.transform = "translateY(50px) rotateX(90deg)"
          headingTextRef.current!.appendChild(charSpan)

          gsap.to(charSpan, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            delay: 0.1 * index,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          })
        })

        const projectsText = headingAccentRef.current.textContent || ""
        headingAccentRef.current.innerHTML = ""

        projectsText.split("").forEach((char, index) => {
          const charSpan = document.createElement("span")
          charSpan.textContent = char
          charSpan.style.display = "inline-block"
          charSpan.style.opacity = "0"
          charSpan.style.transform = "translateY(50px) rotateX(90deg)"
          headingAccentRef.current!.appendChild(charSpan)

          gsap.to(charSpan, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            delay: 0.1 * (index + ourText.length + 1),
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          })
        })
      }

      if (descriptionRef.current) {
        const originalText = descriptionRef.current.textContent || ""
        const words = originalText.split(" ")
        descriptionRef.current.innerHTML = ""

        words.forEach((word, index) => {
          const wordSpan = document.createElement("span")
          wordSpan.textContent = word
          wordSpan.style.display = "inline-block"
          wordSpan.style.opacity = "0"
          descriptionRef.current!.appendChild(wordSpan)

          // ✅ Add real space between words
          descriptionRef.current!.appendChild(document.createTextNode(" "))

          gsap.fromTo(
            wordSpan,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.3,
              delay: 0.03 * index,
              scrollTrigger: {
                trigger: descriptionRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
              onStart: () => {
                const originalWord = word
                let step = 0
                const steps = 10
                const chars = "!@0#X7"

                const scrambleInterval = setInterval(() => {
                  if (step >= steps) {
                    clearInterval(scrambleInterval)
                    wordSpan.textContent = originalWord
                    return
                  }

                  let scrambledWord = ""
                  for (let i = 0; i < originalWord.length; i++) {
                    if (i < Math.floor((step / steps) * originalWord.length)) {
                      scrambledWord += originalWord[i]
                    } else {
                      scrambledWord += chars[Math.floor(Math.random() * chars.length)]
                    }
                  }

                  wordSpan.textContent = scrambledWord
                  step++
                }, 300)
              },
            }
          )
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="projects" className="py-20 bg-gray-950 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 ref={headingRef} className="text-4xl md:text-6xl font-bold text-center mb-12">
          <span ref={headingTextRef} className="text-white">Our</span>{" "}
          <span ref={headingAccentRef} className="relative inline-block text-cyan-400 neon-glow-text-cyan">Projects</span>
        </h2>

        <p ref={descriptionRef} className="text-center text-gray-300 max-w-3xl mx-auto mb-20">
          Explore our innovative projects that push the boundaries of technology and create solutions for tomorrow&apos;s challenges.
        </p>

        <div className="flex flex-col gap-20">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0
            return (
              <motion.div key={project.id} className="project-card group" whileHover={{ scale: 1.02 }}>
                <div className={`flex flex-col md:flex-row ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 bg-gray-900/50 p-6 rounded-xl shadow-lg overflow-hidden`}>
                  <div className="w-full md:w-1/2 h-60 md:h-80 overflow-hidden rounded-xl relative image-box">
                     <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  </div>

                  <div className="w-full md:w-1/2 space-y-4 text-left text-box">
                    <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                    <p className="text-gray-300">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-sm bg-purple-950/50 text-purple-400 rounded-full border border-purple-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-20 text-center">
          <button className="px-8 py-4 bg-transparent border-2 border-cyan-500 text-cyan-400 rounded-full hover:bg-cyan-500/10 transition-all duration-300">
            <span className="font-medium flex items-center gap-2">
              View All Projects <ArrowRight size={16} />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
