"use client"

import { useEffect, useRef } from "react"

export default function OptimizedParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number>(0)
  const mousePosition = useRef({ x: 0, y: 0 })
  const isMouseMoving = useRef(false)

  // Define the specific colors requested
  const particleColors = ["#00f3ff", "#9d4edd", "#ff00e5"]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
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

    // Particle class for better performance
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.size = Math.random() * 1.5 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3
        this.color = particleColors[Math.floor(Math.random() * particleColors.length)]
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Boundary check with wrap-around
        if (this.x > window.innerWidth) this.x = 0
        else if (this.x < 0) this.x = window.innerWidth
        if (this.y > window.innerHeight) this.y = 0
        else if (this.y < 0) this.y = window.innerHeight

        // Mouse interaction
        if (isMouseMoving.current) {
          const dx = mousePosition.current.x - this.x
          const dy = mousePosition.current.y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 80) {
            const angle = Math.atan2(dy, dx)
            const force = (80 - distance) / 1500
            this.speedX -= Math.cos(angle) * force
            this.speedY -= Math.sin(angle) * force
          }
        }

        // Apply drag
        this.speedX *= 0.98
        this.speedY *= 0.98
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles - reduced count for better performance
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 80)
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current.x = e.clientX
      mousePosition.current.y = e.clientY
      isMouseMoving.current = true

      // Reset the flag after 100ms of no movement
      setTimeout(() => {
        isMouseMoving.current = false
      }, 100)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", setCanvasSize)

    // Animation loop
    const animate = () => {
      // Clear canvas with slight fade effect for trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw(ctx)
      }

      // Draw connections - only between nearby particles
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)"
      ctx.lineWidth = 0.5

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 70) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

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
