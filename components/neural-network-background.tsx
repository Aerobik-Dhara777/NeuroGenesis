"use client"

import { useEffect, useRef } from "react"

interface Node {
  x: number
  y: number
  size: number
  connections: number[]
  pulsePhase: number
  pulseSpeed: number
  color: string
  active: boolean
  activationTime: number
}

interface Pulse {
  startNode: number
  endNode: number
  position: number // 0 to 1
  speed: number
  color: string
  size: number
}

export default function NeuralNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodes = useRef<Node[]>([])
  const pulses = useRef<Pulse[]>([])
  const animationFrameId = useRef<number>(0)
  const hueRotation = useRef(0)
  const mousePosition = useRef({ x: 0, y: 0 })

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

    // Create neural network nodes
    const createNodes = () => {
      nodes.current = []
      const nodeCount = Math.min(Math.floor(window.innerWidth / 100) * 5, 50)

      for (let i = 0; i < nodeCount; i++) {
        const hue = Math.random() > 0.5 ? 180 + Math.random() * 40 : 270 + Math.random() * 40 // Cyan or Purple
        nodes.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 2,
          connections: [],
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.03 + Math.random() * 0.03,
          color: `hsl(${hue}, 100%, 70%)`,
          active: false,
          activationTime: 0,
        })
      }
    }

    createNodes()

    // Find connections between nodes
    const findConnections = () => {
      for (let i = 0; i < nodes.current.length; i++) {
        nodes.current[i].connections = []
        // Each node connects to 2-5 other nodes
        const connectionCount = Math.floor(Math.random() * 4) + 2

        // Create an array of potential connections sorted by distance
        const potentialConnections = []
        for (let j = 0; j < nodes.current.length; j++) {
          if (i !== j) {
            const dx = nodes.current[i].x - nodes.current[j].x
            const dy = nodes.current[i].y - nodes.current[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)
            potentialConnections.push({ index: j, distance })
          }
        }

        // Sort by distance
        potentialConnections.sort((a, b) => a.distance - b.distance)

        // Take the closest nodes as connections
        for (let k = 0; k < Math.min(connectionCount, potentialConnections.length); k++) {
          nodes.current[i].connections.push(potentialConnections[k].index)
        }
      }
    }

    // Create a pulse between two nodes
    const createPulse = (startNodeIndex: number, endNodeIndex: number) => {
      const startNode = nodes.current[startNodeIndex]
      const endNode = nodes.current[endNodeIndex]

      // Random color between cyan and purple
      const hue = Math.random() > 0.5 ? 180 + Math.random() * 40 : 270 + Math.random() * 40

      pulses.current.push({
        startNode: startNodeIndex,
        endNode: endNodeIndex,
        position: 0,
        speed: 0.01 + Math.random() * 0.02,
        color: `hsl(${hue}, 100%, 70%)`,
        size: Math.random() * 2 + 1,
      })
    }

    // Randomly activate nodes and create pulses
    const activateRandomNode = () => {
      const randomNodeIndex = Math.floor(Math.random() * nodes.current.length)
      const node = nodes.current[randomNodeIndex]

      node.active = true
      node.activationTime = Date.now()

      // Create pulses to connected nodes
      node.connections.forEach((connectedNodeIndex) => {
        createPulse(randomNodeIndex, connectedNodeIndex)
      })
    }

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current.x = e.clientX
      mousePosition.current.y = e.clientY

      // Find the closest node to the mouse
      let closestNodeIndex = -1
      let closestDistance = Number.POSITIVE_INFINITY

      nodes.current.forEach((node, index) => {
        const dx = node.x - e.clientX
        const dy = node.y - e.clientY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < closestDistance) {
          closestDistance = distance
          closestNodeIndex = index
        }
      })

      // If mouse is close enough to a node, activate it
      if (closestDistance < 100 && closestNodeIndex !== -1) {
        const node = nodes.current[closestNodeIndex]
        node.active = true
        node.activationTime = Date.now()

        // Create pulses to connected nodes
        node.connections.forEach((connectedNodeIndex) => {
          createPulse(closestNodeIndex, connectedNodeIndex)
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Set up initial connections
    findConnections()

    // Set interval for random activations
    const activationInterval = setInterval(activateRandomNode, 2000)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update hue rotation for color cycling effect
      hueRotation.current = (hueRotation.current + 0.1) % 360

      // Draw connections
      nodes.current.forEach((node, i) => {
        node.connections.forEach((connectedIndex) => {
          const connectedNode = nodes.current[connectedIndex]

          // Create gradient for connection
          const gradient = ctx.createLinearGradient(node.x, node.y, connectedNode.x, connectedNode.y)
          gradient.addColorStop(
            0,
            node.active
              ? `hsla(${Number.parseInt(node.color.slice(4)) + hueRotation.current}, 100%, 70%, 0.3)`
              : `hsla(${Number.parseInt(node.color.slice(4)) + hueRotation.current}, 100%, 70%, 0.1)`,
          )
          gradient.addColorStop(
            1,
            connectedNode.active
              ? `hsla(${Number.parseInt(connectedNode.color.slice(4)) + hueRotation.current}, 100%, 70%, 0.3)`
              : `hsla(${Number.parseInt(connectedNode.color.slice(4)) + hueRotation.current}, 100%, 70%, 0.1)`,
          )

          ctx.strokeStyle = gradient
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(connectedNode.x, connectedNode.y)
          ctx.stroke()
        })
      })

      // Update and draw pulses
      pulses.current.forEach((pulse, index) => {
        pulse.position += pulse.speed

        if (pulse.position >= 1) {
          // Activate the end node when pulse reaches it
          nodes.current[pulse.endNode].active = true
          nodes.current[pulse.endNode].activationTime = Date.now()

          // Remove the pulse
          pulses.current.splice(index, 1)
          return
        }

        const startNode = nodes.current[pulse.startNode]
        const endNode = nodes.current[pulse.endNode]

        // Calculate pulse position
        const x = startNode.x + (endNode.x - startNode.x) * pulse.position
        const y = startNode.y + (endNode.y - startNode.y) * pulse.position

        // Draw pulse
        ctx.shadowBlur = 10
        ctx.shadowColor = `hsla(${Number.parseInt(pulse.color.slice(4)) + hueRotation.current}, 100%, 70%, 0.8)`
        ctx.fillStyle = `hsla(${Number.parseInt(pulse.color.slice(4)) + hueRotation.current}, 100%, 70%, 0.8)`
        ctx.beginPath()
        ctx.arc(x, y, pulse.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Draw nodes
      nodes.current.forEach((node) => {
        // Check if node should deactivate
        if (node.active && Date.now() - node.activationTime > 2000) {
          node.active = false
        }

        // Calculate pulse effect
        const pulseEffect = Math.sin(node.pulsePhase) * 0.5 + 0.5
        node.pulsePhase += node.pulseSpeed

        // Draw node with glow effect
        const nodeSize = node.size * (node.active ? 1.5 : 1) * (pulseEffect * 0.3 + 0.7)
        const nodeOpacity = node.active ? 0.9 : 0.5

        ctx.shadowBlur = node.active ? 20 : 10
        ctx.shadowColor = `hsla(${Number.parseInt(node.color.slice(4)) + hueRotation.current}, 100%, 70%, ${nodeOpacity})`
        ctx.fillStyle = `hsla(${Number.parseInt(node.color.slice(4)) + hueRotation.current}, 100%, 70%, ${nodeOpacity})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2)
        ctx.fill()

        // Draw outer ring for active nodes
        if (node.active) {
          ctx.strokeStyle = `hsla(${Number.parseInt(node.color.slice(4)) + hueRotation.current}, 100%, 90%, ${0.5 * pulseEffect})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(node.x, node.y, nodeSize + 5 * pulseEffect, 0, Math.PI * 2)
          ctx.stroke()
        }

        ctx.shadowBlur = 0
      })

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      window.removeEventListener("mousemove", handleMouseMove)
      clearInterval(activationInterval)
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-1]" />
}
