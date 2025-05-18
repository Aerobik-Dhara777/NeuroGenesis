"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Menu } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const navItemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation for the navbar container
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
      })

      // Animate each nav item individually, line by line from top
      const navItems = gsap.utils.toArray(".nav-item")
      gsap.from(navItems, {
        y: -50,
        opacity: 0,
        stagger: 0.1, // Stagger the animations
        duration: 0.8,
        delay: 0.8,
        ease: "back.out(1.7)",
      })

      // Menu items animation
      if (isMenuOpen) {
        gsap.fromTo(
          ".menu-item",
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power3.out" },
        )
      }
    })

    return () => ctx.revert()
  }, [isMenuOpen])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 50) {
          navRef.current.classList.add("bg-black/80", "backdrop-blur-lg")
          navRef.current.classList.remove("bg-transparent")
        } else {
          navRef.current.classList.remove("bg-black/80", "backdrop-blur-lg")
          navRef.current.classList.add("bg-transparent")
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <div ref={navRef} className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-white text-xl font-bold nav-item">NeuroSpark1</span>
          </div>

          <div ref={navItemsRef} className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-cyan-400 transition-colors nav-item">
              Home
            </a>
            <a href="#team" className="text-white hover:text-cyan-400 transition-colors nav-item">
              Team
            </a>
            <a href="#projects" className="text-white hover:text-cyan-400 transition-colors nav-item">
              Projects
            </a>
            <a href="#vision" className="text-white hover:text-cyan-400 transition-colors nav-item">
              Vision
            </a>
            <a href="#contact" className="text-white hover:text-cyan-400 transition-colors nav-item">
              Contact
            </a>
          </div>

          <button className="md:hidden text-white nav-item" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50 flex flex-col items-center justify-center"
        >
          <button className="absolute top-6 right-6 text-white" onClick={() => setIsMenuOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="flex flex-col items-center space-y-6">
            <a
              href="#"
              className="menu-item text-white text-2xl hover:text-cyan-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#team"
              className="menu-item text-white text-2xl hover:text-cyan-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Team
            </a>
            <a
              href="#projects"
              className="menu-item text-white text-2xl hover:text-cyan-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </a>
            <a
              href="#vision"
              className="menu-item text-white text-2xl hover:text-cyan-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Vision
            </a>
            <a
              href="#contact"
              className="menu-item text-white text-2xl hover:text-cyan-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </>
  )
}
