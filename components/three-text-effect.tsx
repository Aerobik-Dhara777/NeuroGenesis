"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
// @ts-ignore
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader";
// @ts-ignore
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
// @ts-ignore
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
// @ts-ignore
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// @ts-ignore
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";


interface SparkParticle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  mesh: THREE.Mesh
  life: number
  maxLife: number
}

export default function ThreeTextEffect() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const textMeshRef = useRef<THREE.Mesh | null>(null)
  const sparkParticlesRef = useRef<SparkParticle[]>([])
  const composerRef = useRef<EffectComposer | null>(null)
  const frameRef = useRef<number>(0)
  const fontRef = useRef<Font | null>(null)
  const textLoadedRef = useRef<boolean>(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize Three.js
    const init = async () => {
      // Scene
      const scene = new THREE.Scene()
      sceneRef.current = scene

      // Camera
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.z = 15
      cameraRef.current = camera

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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

      // Load font and create text
      await loadFontAndCreateText()

      // Event listeners
      window.addEventListener("resize", handleResize)
    }

    const loadFontAndCreateText = async () => {
      return new Promise<void>((resolve) => {
        const loader = new FontLoader()

        loader.load("/fonts/helvetiker_bold.typeface.json", (font: Font) => {
          fontRef.current = font
          createText()
          textLoadedRef.current = true
          resolve()
        })
      })
    }

    const createText = () => {
      if (!fontRef.current || !sceneRef.current) return

      // Create text geometry
      const textGeometry = new TextGeometry("NeuroSpark1", {
        font: fontRef.current,
        size: 3,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      })

      // Center text
      textGeometry.computeBoundingBox()
      const textWidth = textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x

      // Create material with glow
      const textMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
      })

      const textMesh = new THREE.Mesh(textGeometry, textMaterial)
      textMesh.position.x = -textWidth / 2
      textMesh.position.y = 0

      sceneRef.current.add(textMesh)
      textMeshRef.current = textMesh
    }

    const createSparkParticle = (position: THREE.Vector3) => {
      const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8)

      // Random color between cyan and purple
      const colorChoice = Math.random() > 0.5 ? 0x00ffff : 0xb300ff

      const particleMaterial = new THREE.MeshBasicMaterial({
        color: colorChoice,
        transparent: true,
        opacity: 0.8,
      })

      const mesh = new THREE.Mesh(particleGeometry, particleMaterial)
      mesh.position.copy(position)

      // Random velocity
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
      )

      // Random life
      const life = 1.0
      const maxLife = 1.0

      sceneRef.current?.add(mesh)

      return {
        position: mesh.position,
        velocity,
        mesh,
        life,
        maxLife,
      }
    }

    const emitSparkParticles = () => {
      if (!textMeshRef.current) return

      // Get random position on the text
      const textBoundingBox = new THREE.Box3().setFromObject(textMeshRef.current)

      const randomX = Math.random() * (textBoundingBox.max.x - textBoundingBox.min.x) + textBoundingBox.min.x
      const randomY = Math.random() * (textBoundingBox.max.y - textBoundingBox.min.y) + textBoundingBox.min.y
      const randomZ = Math.random() * (textBoundingBox.max.z - textBoundingBox.min.z) + textBoundingBox.min.z

      const position = new THREE.Vector3(randomX, randomY, randomZ)

      // Create spark particles
      const particleCount = 3 + Math.floor(Math.random() * 3)

      for (let i = 0; i < particleCount; i++) {
        const sparkParticle = createSparkParticle(position)
        sparkParticlesRef.current.push(sparkParticle)
      }

      // Limit particles for performance
      if (sparkParticlesRef.current.length > 300) {
        const particlesToRemove = sparkParticlesRef.current.splice(0, 50)
        particlesToRemove.forEach((particle) => {
          sceneRef.current?.remove(particle.mesh)
          particle.mesh.geometry.dispose()
          ;(particle.mesh.material as THREE.Material).dispose()
        })
      }
    }

    const updateSparkParticles = () => {
      const particles = sparkParticlesRef.current
      const particlesToRemove: SparkParticle[] = []

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]

        // Update position
        particle.position.add(particle.velocity)

        // Update life
        particle.life -= 0.02

        // Update opacity based on life
        const material = particle.mesh.material as THREE.MeshBasicMaterial
        material.opacity = particle.life / particle.maxLife

        // Scale down as life decreases
        const scale = (particle.life / particle.maxLife) * 0.05
        particle.mesh.scale.set(scale, scale, scale)

        // Remove dead particles
        if (particle.life <= 0) {
          particlesToRemove.push(particle)
        }
      }

      // Remove dead particles
      particlesToRemove.forEach((particle) => {
        const index = particles.indexOf(particle)
        if (index !== -1) {
          particles.splice(index, 1)
        }

        sceneRef.current?.remove(particle.mesh)
        particle.mesh.geometry.dispose()
        ;(particle.mesh.material as THREE.Material).dispose()
      })
    }

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      if (textLoadedRef.current) {
        // Emit spark particles occasionally
        if (Math.random() < 0.3) {
          emitSparkParticles()
        }

        // Update spark particles
        updateSparkParticles()

        // Subtle floating animation for text
        if (textMeshRef.current) {
          textMeshRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.05
          textMeshRef.current.rotation.y = Math.sin(Date.now() * 0.0003) * 0.05
        }
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

    // Initialize and start animation
    init()
    animate()

    // Cleanup
    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }

      window.removeEventListener("resize", handleResize)

      cancelAnimationFrame(frameRef.current)

      // Dispose geometries and materials
      if (textMeshRef.current) {
        textMeshRef.current.geometry.dispose()
        ;(textMeshRef.current.material as THREE.Material).dispose()
      }

      sparkParticlesRef.current.forEach((particle) => {
        particle.mesh.geometry.dispose()
        ;(particle.mesh.material as THREE.Material).dispose()
      })
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 z-10 pointer-events-none" />
}
