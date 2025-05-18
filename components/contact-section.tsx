"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"
import { Send, Github, Linkedin, Twitter, Instagram } from "lucide-react"

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic would go here
    console.log("Form submitted:", formState)

    // Animation for successful submission
    gsap.to(formRef.current, {
      y: -10,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        // Reset form
        setFormState({ name: "", email: "", message: "" })

        // Show success message
        gsap.to(".success-message", {
          display: "flex",
          opacity: 1,
          y: 0,
          duration: 0.5,
        })

        // Hide success message after 3 seconds
        setTimeout(() => {
          gsap.to(".success-message", {
            opacity: 0,
            y: -10,
            duration: 0.5,
            onComplete: () => {
              gsap.set(".success-message", { display: "none" })
              gsap.to(formRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.5,
              })
            },
          })
        }, 3000)
      },
    })
  }

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
        ".contact-description",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.2,
          scrollTrigger: {
            trigger: ".contact-description",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Animate form
      gsap.fromTo(
        formRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3,
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Animate social icons
      gsap.fromTo(
        ".social-icon",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          delay: 0.5,
          scrollTrigger: {
            trigger: ".social-icons",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Animate form inputs on focus
      const inputs = gsap.utils.toArray<Element>("input, textarea")

      inputs.forEach((input: Element) => {
        const inputElement = input as HTMLInputElement | HTMLTextAreaElement

        inputElement.addEventListener("focus", () => {
          gsap.to(inputElement, {
            boxShadow: "0 0 0 2px rgba(0, 255, 255, 0.5)",
            duration: 0.3,
          })

          // Animate label
          const label = inputElement.previousElementSibling
          if (label) {
            gsap.to(label, {
              y: -5,
              color: "#22d3ee",
              duration: 0.3,
            })
          }
        })

        inputElement.addEventListener("blur", () => {
          gsap.to(inputElement, {
            boxShadow: "none",
            duration: 0.3,
          })

          // Reset label if input is empty
          const label = inputElement.previousElementSibling
          if (label && !inputElement.value) {
            gsap.to(label, {
              y: 0,
              color: "#9ca3af",
              duration: 0.3,
            })
          }
        })
      })

      // Glowing button animation
      gsap.to(".submit-btn", {
        boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
      })

      // Animate the decorative elements
      gsap.fromTo(
        ".contact-decoration",
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
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="py-20 bg-gray-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="contact-decoration absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
      <div className="contact-decoration absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
      <div className="contact-decoration absolute -top-40 -right-40 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
      <div className="contact-decoration absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 ref={headingRef} className="text-4xl md:text-6xl font-bold text-center mb-6">
          <span className="text-white">Get in</span>{" "}
          <span className="text-purple-400 neon-glow-text-purple">Touch</span>
        </h2>

        <p className="contact-description text-center text-gray-300 max-w-3xl mx-auto mb-16">
          Have a project in mind or want to collaborate? We'd love to hear from you. Reach out and let's create
          something amazing together.
        </p>

        <div className="max-w-3xl mx-auto">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl p-8 border border-cyan-500/20 shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-400 text-sm mb-2 transition-all duration-300">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:outline-none text-white transition-all duration-300"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-400 text-sm mb-2 transition-all duration-300">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:outline-none text-white transition-all duration-300"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-400 text-sm mb-2 transition-all duration-300">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:outline-none text-white transition-all duration-300"
                required
              ></textarea>
            </div>

            <div className="text-center">
              <motion.button
                type="submit"
                className="submit-btn px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 mx-auto neon-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Send Message</span>
                <Send size={16} />
              </motion.button>
            </div>

            {/* Animated corner accents */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-cyan-500/50"></div>
            <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-cyan-500/50"></div>
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-cyan-500/50"></div>
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-cyan-500/50"></div>
          </form>

          <div className="success-message hidden opacity-0 flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-cyan-500/20 shadow-[0_0_30px_rgba(0,0,0,0.3)] mt-4">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-cyan-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
            <p className="text-gray-300 text-center">Thank you for reaching out. We'll get back to you soon!</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-300 mb-6">Connect with us on social media</p>
          <div className="social-icons flex justify-center gap-6">
            <motion.a
              href="#"
              className="social-icon w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-cyan-400 hover:bg-cyan-500 hover:text-white transition-colors duration-300 border border-cyan-500/30"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Twitter size={20} />
            </motion.a>
            <motion.a
              href="#"
              className="social-icon w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-cyan-400 hover:bg-cyan-500 hover:text-white transition-colors duration-300 border border-cyan-500/30"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Instagram size={20} />
            </motion.a>
            <motion.a
              href="#"
              className="social-icon w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-cyan-400 hover:bg-cyan-500 hover:text-white transition-colors duration-300 border border-cyan-500/30"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Linkedin size={20} />
            </motion.a>
            <motion.a
              href="#"
              className="social-icon w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-cyan-400 hover:bg-cyan-500 hover:text-white transition-colors duration-300 border border-cyan-500/30"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Github size={20} />
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  )
}
