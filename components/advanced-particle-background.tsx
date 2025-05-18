"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  connections: number[]
  opacity: number
  hue: number
}

export default function AdvancedParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const mousePosition = useRef({ x: 0, y: 0 })
  const isMouseMoving = useRef(false)
  const animationFrameId = useRef<number>(0)
  const hueRotation = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // Create particles
    const createParticles = () => {
      particles.current = []
      const particleCount = Math.min(Math.floor(window.innerWidth / 8), 200)

      for (let i = 0; i < particleCount; i++) {
        const hue = Math.random() > 0.5 ? 180 + Math.random() * 40 : 270 + Math.random() * 40 // Cyan or Purple
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          color: `hsla(${hue}, 100%, 70%, ${Math.random() * 0.5 + 0.3})`,
          connections: [],
          opacity: Math.random() * 0.5 + 0.3,
          hue: hue,
        })
      }
    }

    createParticles()

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current.x = e.clientX
      mousePosition.current.y = e.clientY
      isMouseMoving.current = true

      // Create ripple effect
      for (let i = 0; i < 3; i++) {
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 2 + 1,
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 - 1,
          color: `hsla(${180 + Math.random() * 40}, 100%, 70%, ${Math.random() * 0.5 + 0.5})`,
          connections: [],
          opacity: 0.8,
          hue: 180 + Math.random() * 40,
        })
      }

      // Limit particles to prevent performance issues
      if (particles.current.length > 300) {
        particles.current = particles.current.slice(-300)
      }

      // Reset the flag after 100ms of no movement
      setTimeout(() => {
        isMouseMoving.current = false
      }, 100)
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Find connections between particles
    const findConnections = () => {
      for (let i = 0; i < particles.current.length; i++) {
        particles.current[i].connections = []
        for (let j = i + 1; j < particles.current.length; j++) {
          const dx = particles.current[i].x - particles.current[j].x
          const dy = particles.current[i].y - particles.current[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            particles.current[i].connections.push(j)
          }
        }
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update hue rotation for color cycling effect
      hueRotation.current = (hueRotation.current + 0.1) % 360

      // Update and draw particles
      particles.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Boundary check
        if (particle.x > canvas.width) particle.x = 0
        else if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        else if (particle.y < 0) particle.y = canvas.height

        // Mouse interaction
        if (isMouseMoving.current) {
          const dx = mousePosition.current.x - particle.x
          const dy = mousePosition.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const angle = Math.atan2(dy, dx)
            const force = (150 - distance) / 1500
            particle.speedX -= Math.cos(angle) * force
            particle.speedY -= Math.sin(angle) * force

            // Increase opacity when near mouse
            particle.opacity = Math.min(0.9, particle.opacity + 0.01)
          } else {
            // Gradually return to original opacity
            particle.opacity = Math.max(0.3, particle.opacity - 0.005)
          }
        }

        // Apply some drag to slow particles
        particle.speedX *= 0.99
        particle.speedY *= 0.99

        // Draw particle with glow effect
        ctx.shadowBlur = 15
        ctx.shadowColor = `hsla(${particle.hue + hueRotation.current}, 100%, 70%, 0.5)`
        ctx.fillStyle = `hsla(${particle.hue + hueRotation.current}, 100%, 70%, ${particle.opacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Find connections
      findConnections()

      // Draw connections
      particles.current.forEach((particle) => {
        particle.connections.forEach((connectionIndex) => {
          const connectedParticle = particles.current[connectionIndex]
          const dx = particle.x - connectedParticle.x
          const dy = particle.y - connectedParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const opacity = 1 - distance / 100

          // Create gradient for thread-like effect
          const gradient = ctx.createLinearGradient(particle.x, particle.y, connectedParticle.x, connectedParticle.y)
          gradient.addColorStop(0, `hsla(${particle.hue + hueRotation.current}, 100%, 70%, ${opacity * 0.5})`)
          gradient.addColorStop(1, `hsla(${connectedParticle.hue + hueRotation.current}, 100%, 70%, ${opacity * 0.5})`)

          ctx.strokeStyle = gradient
          ctx.lineWidth = Math.min(particle.size, connectedParticle.size) * 0.5
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(connectedParticle.x, connectedParticle.y)
          ctx.stroke()
        })
      })

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-1]" />
}
