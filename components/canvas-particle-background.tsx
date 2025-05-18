"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  opacity: number
}

export default function CanvasParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mousePosition = useRef({ x: 0, y: 0 })
  const mouseVelocity = useRef({ x: 0, y: 0 })
  const lastMousePosition = useRef({ x: 0, y: 0 })
  const animationFrameId = useRef<number>(0)

  // // Define the specific colors requested
  // const particleColors = ["#00f3ff", "#9d4edd", "#ff00e5"]

  useEffect(() => {
    const particleColors = ["#00f3ff", "#9d4edd", "#ff00e5"]

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }

    setCanvasSize()

    // Create particles
    const createParticles = () => {
      particlesRef.current = []
      const particleCount = Math.min(Math.floor(window.innerWidth / 10), 200)

      for (let i = 0; i < particleCount; i++) {
        const color = particleColors[Math.floor(Math.random() * particleColors.length)]
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color,
          opacity: Math.random() * 0.5 + 0.3,
        })
      }
    }

    createParticles()

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position
      mousePosition.current.x = e.clientX
      mousePosition.current.y = e.clientY

      // Calculate mouse velocity
      mouseVelocity.current.x = mousePosition.current.x - lastMousePosition.current.x
      mouseVelocity.current.y = mousePosition.current.y - lastMousePosition.current.y

      // Update last position
      lastMousePosition.current.x = mousePosition.current.x
      lastMousePosition.current.y = mousePosition.current.y

      // Add particles at mouse position for interactive effect
      for (let i = 0; i < 2; i++) {
        const color = particleColors[Math.floor(Math.random() * particleColors.length)]
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
          color,
          opacity: 0.7,
        })
      }

      // Limit particles to prevent performance issues
      if (particlesRef.current.length > 300) {
        particlesRef.current = particlesRef.current.slice(-300)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", setCanvasSize)

    // Animation loop
    const animate = () => {
      // Clear canvas with slight fade effect for trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX + mouseVelocity.current.x * 0.05
        particle.y += particle.speedY + mouseVelocity.current.y * 0.05

        // Boundary check with wrap-around
        if (particle.x > canvas.width) particle.x = 0
        else if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        else if (particle.y < 0) particle.y = canvas.height

        // Apply drag
        particle.speedX *= 0.99
        particle.speedY *= 0.99

        // Draw particle
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // Draw connections between nearby particles
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
      ctx.lineWidth = 0.5

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x
          const dy = particlesRef.current[i].y - particlesRef.current[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.globalAlpha = (1 - distance / 100) * 0.2
            ctx.beginPath()
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y)
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y)
            ctx.stroke()
          }
        }
      }

      // Gradually reduce mouse velocity for smoother effect
      mouseVelocity.current.x *= 0.95
      mouseVelocity.current.y *= 0.95

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", setCanvasSize)
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-1]" />
}
