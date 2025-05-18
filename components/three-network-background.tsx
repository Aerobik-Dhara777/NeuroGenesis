"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"

interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  acceleration: THREE.Vector3
  connections: number[]
  color: THREE.Color
  size: number
  mesh: THREE.Mesh
}

export default function ThreeNetworkBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0))
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const composerRef = useRef<EffectComposer | null>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize Three.js
    const init = () => {
      // Scene
      const scene = new THREE.Scene()
      sceneRef.current = scene

      // Camera
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.z = 30
      cameraRef.current = camera

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setClearColor(0x000000, 0)
      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement)
      }
      rendererRef.current = renderer

      // Post-processing
      const composer = new EffectComposer(renderer)
      const renderPass = new RenderPass(scene, camera)
      composer.addPass(renderPass)

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // strength
        0.4, // radius
        0.85, // threshold
      )
      composer.addPass(bloomPass)
      composerRef.current = composer

      // Create particles
      createParticles()

      // Event listeners
      window.addEventListener("resize", handleResize)
      window.addEventListener("mousemove", handleMouseMove)
    }

    const createParticles = () => {
      const particles: Particle[] = []
      const particleCount = 150
      const particleGeometry = new THREE.SphereGeometry(1, 16, 16)

      // Create particles
      for (let i = 0; i < particleCount; i++) {
        // Determine color - either cyan or purple
        const colorChoice = Math.random() > 0.5 ? 0x00ffff : 0xb300ff
        const color = new THREE.Color(colorChoice)

        // Create material with glow
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.8,
        })

        const mesh = new THREE.Mesh(particleGeometry, particleMaterial)

        // Random position in a sphere
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const radius = 20 + Math.random() * 30
        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.sin(phi) * Math.sin(theta)
        const z = radius * Math.cos(phi) * (Math.random() - 0.5)

        mesh.position.set(x, y, z)

        // Random size
        const size = Math.random() * 0.3 + 0.1
        mesh.scale.set(size, size, size)

        // Add to scene
        sceneRef.current?.add(mesh)

        // Create particle object
        particles.push({
          position: mesh.position,
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05,
          ),
          acceleration: new THREE.Vector3(0, 0, 0),
          connections: [],
          color: color,
          size: size,
          mesh: mesh,
        })
      }

      // Find connections between particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].connections = []
        for (let j = 0; j < particles.length; j++) {
          if (i !== j) {
            const distance = particles[i].position.distanceTo(particles[j].position)
            if (distance < 15) {
              particles[i].connections.push(j)
            }
          }
        }
      }

      particlesRef.current = particles

      // Create connections (lines)
      updateConnections()
    }

    const updateConnections = () => {
      // Remove old lines
      sceneRef.current?.children.forEach((child) => {
        if (child instanceof THREE.Line) {
          sceneRef.current?.remove(child)
        }
      })

      // Create new lines
      const particles = particlesRef.current

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]

        for (let j = 0; j < particle.connections.length; j++) {
          const connectedParticle = particles[particle.connections[j]]

          // Only draw connection once (not both ways)
          if (i < particle.connections[j]) {
            const points = []
            points.push(particle.position.clone())
            points.push(connectedParticle.position.clone())

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

            // Create gradient-like effect by using the colors of both particles
            const lineMaterial = new THREE.LineBasicMaterial({
              color: particle.color.clone().lerp(connectedParticle.color, 0.5),
              transparent: true,
              opacity: 0.2,
            })

            const line = new THREE.Line(lineGeometry, lineMaterial)
            sceneRef.current?.add(line)
          }
        }
      }
    }

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      // Update particles
      const particles = particlesRef.current

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]

        // Apply velocity
        particle.position.add(particle.velocity)

        // Boundary check - wrap around
        if (particle.position.x > 40) particle.position.x = -40
        else if (particle.position.x < -40) particle.position.x = 40
        if (particle.position.y > 40) particle.position.y = -40
        else if (particle.position.y < -40) particle.position.y = 40
        if (particle.position.z > 40) particle.position.z = -40
        else if (particle.position.z < -40) particle.position.z = 40

        // Mouse interaction
        if (mouseRef.current.x !== 0 || mouseRef.current.y !== 0) {
          raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current!)
          const intersects = raycasterRef.current.intersectObject(particle.mesh)

          if (intersects.length > 0) {
            // Repel from mouse
            const direction = new THREE.Vector3().subVectors(particle.position, cameraRef.current!.position).normalize()

            particle.velocity.add(direction.multiplyScalar(0.01))
          }
        }

        // Apply some drag
        particle.velocity.multiplyScalar(0.99)
      }

      // Update connections every few frames for performance
      if (frameRef.current % 10 === 0) {
        updateConnections()
      }

      // Rotate camera slightly for parallax effect
      if (cameraRef.current) {
        cameraRef.current.position.x = Math.sin(Date.now() * 0.0001) * 5
        cameraRef.current.position.y = Math.cos(Date.now() * 0.0001) * 5
        cameraRef.current.lookAt(0, 0, 0)
      }

      // Render
      composerRef.current?.render()
    }

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !composerRef.current) return

      const width = window.innerWidth
      const height = window.innerHeight

      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()

      rendererRef.current.setSize(width, height)
      composerRef.current.setSize(width, height)
    }

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    // Initialize and start animation
    init()
    animate()

    // Cleanup
    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }

      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)

      cancelAnimationFrame(frameRef.current)

      // Dispose geometries and materials
      particlesRef.current.forEach((particle) => {
        particle.mesh.geometry.dispose()
        ;(particle.mesh.material as THREE.Material).dispose()
      })
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 z-[-1]" />
}
