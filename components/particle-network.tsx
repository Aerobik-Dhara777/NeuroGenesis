"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function ParticleNetwork() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const linesRef = useRef<THREE.LineSegments | null>(null)
  const frameRef = useRef<number>(0)
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0))

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 30
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create particles
    const particleCount = 200
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      // Position particles in a sphere
      const i3 = i * 3
      const radius = 25 + Math.random() * 15
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi) * (Math.random() - 0.5)

      // Color - either cyan or purple
      const colorChoice = Math.random() > 0.5 ? new THREE.Color(0x00ffff) : new THREE.Color(0xb300ff)
      colors[i3] = colorChoice.r
      colors[i3 + 1] = colorChoice.g
      colors[i3 + 2] = colorChoice.b

      // Size
      sizes[i] = Math.random() * 2 + 0.5
    }

    // Create particle geometry
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    particleGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

    // Particle material
    const particleMaterial = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    })

    // Create particle system
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)
    particlesRef.current = particles

    // Create connections
    const connections: number[] = []
    const lineColors: number[] = []

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const p1 = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2])

      for (let j = i + 1; j < particleCount; j++) {
        const j3 = j * 3
        const p2 = new THREE.Vector3(positions[j3], positions[j3 + 1], positions[j3 + 2])

        if (p1.distanceTo(p2) < 10) {
          connections.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z)

          // Blend the colors of the two particles
          const c1 = new THREE.Color(colors[i3], colors[i3 + 1], colors[i3 + 2])
          const c2 = new THREE.Color(colors[j3], colors[j3 + 1], colors[j3 + 2])
          const blendedColor = c1.clone().lerp(c2, 0.5)

          lineColors.push(blendedColor.r, blendedColor.g, blendedColor.b)
          lineColors.push(blendedColor.r, blendedColor.g, blendedColor.b)
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(connections, 3))
    lineGeometry.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3))

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
    })

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)
    linesRef.current = lines

    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return

      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      if (particlesRef.current && linesRef.current) {
        // Rotate the entire scene slightly based on mouse position
        particlesRef.current.rotation.y += 0.001
        particlesRef.current.rotation.x += 0.0005
        linesRef.current.rotation.y += 0.001
        linesRef.current.rotation.x += 0.0005

        // Add subtle movement based on mouse position
        particlesRef.current.rotation.y += mouseRef.current.x * 0.0005
        particlesRef.current.rotation.x += mouseRef.current.y * 0.0005
        linesRef.current.rotation.y += mouseRef.current.x * 0.0005
        linesRef.current.rotation.x += mouseRef.current.y * 0.0005
      }

      // Render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(frameRef.current)

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }

      if (particlesRef.current) {
        particlesRef.current.geometry.dispose()
        ;(particlesRef.current.material as THREE.Material).dispose()
      }

      if (linesRef.current) {
        linesRef.current.geometry.dispose()
        ;(linesRef.current.material as THREE.Material).dispose()
      }
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 z-[-1]" />
}
