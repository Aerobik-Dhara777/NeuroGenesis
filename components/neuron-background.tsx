"use client"

import { useEffect, useRef } from "react"

interface Neuron {
  x: number
  y: number
  radius: number
  color: string
  vx: number
  vy: number
  connections: number[]
}

interface Pulse {
  sourceIdx: number
  targetIdx: number
  progress: number
  speed: number
  color: string
}

export default function NeuronBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number>(0)
  const neuronsRef = useRef<Neuron[]>([])
  const pulsesRef = useRef<Pulse[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initNeurons()
    }

    // Initialize neurons
    const initNeurons = () => {
      const neurons: Neuron[] = []
      const neuronCount = 20

      // Create neurons
      for (let i = 0; i < neuronCount; i++) {
        const radius = Math.random() * 4 + 2
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const color = Math.random() > 0.5 ? "#00f3ff" : "#ff00e5"
        const vx = (Math.random() - 0.5) * 0.2
        const vy = (Math.random() - 0.5) * 0.2

        neurons.push({
          x,
          y,
          radius,
          color,
          vx,
          vy,
          connections: [],
        })
      }

      // Create connections between neurons
      for (let i = 0; i < neuronCount; i++) {
        const connectionCount = Math.floor(Math.random() * 3) + 2
        const connections: number[] = []

        for (let j = 0; j < connectionCount; j++) {
          let targetIdx
          do {
            targetIdx = Math.floor(Math.random() * neuronCount)
          } while (targetIdx === i || connections.includes(targetIdx))

          connections.push(targetIdx)
        }

        neurons[i].connections = connections
      }

      neuronsRef.current = neurons
      initPulses()
    }

    // Initialize pulses
    const initPulses = () => {
      const pulses: Pulse[] = []
      const neurons = neuronsRef.current

      neurons.forEach((neuron, idx) => {
        neuron.connections.forEach((targetIdx) => {
          if (Math.random() > 0.7) {
            pulses.push({
              sourceIdx: idx,
              targetIdx,
              progress: Math.random(),
              speed: Math.random() * 0.005 + 0.002,
              color: Math.random() > 0.5 ? "#ffffff" : "#00f3ff",
            })
          }
        })
      })

      pulsesRef.current = pulses
    }

    // Draw function
    const draw = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const neurons = neuronsRef.current
      const pulses = pulsesRef.current

      // Update and draw connections
      ctx.lineWidth = 0.5
      neurons.forEach((neuron) => {
        neuron.connections.forEach((targetIdx) => {
          const target = neurons[targetIdx]
          ctx.beginPath()
          ctx.moveTo(neuron.x, neuron.y)
          ctx.lineTo(target.x, target.y)
          ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
          ctx.stroke()
        })
      })

      // Update and draw pulses
      pulses.forEach((pulse) => {
        const source = neurons[pulse.sourceIdx]
        const target = neurons[pulse.targetIdx]

        // Update pulse position
        pulse.progress += pulse.speed
        if (pulse.progress > 1) {
          pulse.progress = 0
        }

        // Calculate position along the connection
        const x = source.x + (target.x - source.x) * pulse.progress
        const y = source.y + (target.y - source.y) * pulse.progress

        // Draw pulse
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fillStyle = pulse.color
        ctx.fill()

        // Add glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8)
        gradient.addColorStop(0, pulse.color)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      // Update and draw neurons
      neurons.forEach((neuron) => {
        // Update position
        neuron.x += neuron.vx
        neuron.y += neuron.vy

        // Bounce off edges
        if (neuron.x < 0 || neuron.x > canvas.width) neuron.vx *= -1
        if (neuron.y < 0 || neuron.y > canvas.height) neuron.vy *= -1

        // Draw neuron
        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2)
        ctx.fillStyle = neuron.color
        ctx.fill()

        // Add glow effect
        const gradient = ctx.createRadialGradient(neuron.x, neuron.y, 0, neuron.x, neuron.y, neuron.radius * 3)
        gradient.addColorStop(0, neuron.color)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, neuron.radius * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })
    }

    // Animation loop
    const animate = () => {
      draw()
      animationFrameId.current = requestAnimationFrame(animate)
    }

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    // Initialize
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-1]" />
}
