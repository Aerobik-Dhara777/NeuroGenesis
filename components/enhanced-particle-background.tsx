"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function EnhancedParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0))
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const clockRef = useRef<THREE.Clock>(new THREE.Clock())
  const animationFrameId = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current) return

    const initThree = () => {
      const scene = new THREE.Scene()
      sceneRef.current = scene

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      camera.position.z = 30
      cameraRef.current = camera

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 0)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement)
      }
      rendererRef.current = renderer

      createParticles()

      window.addEventListener("resize", handleResize)
      window.addEventListener("mousemove", handleMouseMove)

      animate()
    }

    const createParticles = () => {
      if (particlesRef.current) {
        sceneRef.current?.remove(particlesRef.current)
        particlesRef.current.geometry.dispose()
        const material = particlesRef.current.material as THREE.Material
        material.dispose()
      }

      const particleCount = Math.min(Math.floor(window.innerWidth / 5), 2000)
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(particleCount * 3)
      const colors = new Float32Array(particleCount * 3)
      const sizes = new Float32Array(particleCount)
      const randomness = new Float32Array(particleCount * 3)

      const palette = [
        new THREE.Color(0x00f3ff),
        new THREE.Color(0x9d4edd),
        new THREE.Color(0xff00e5),
      ]

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        positions[i3] = (Math.random() - 0.5) * 50
        positions[i3 + 1] = (Math.random() - 0.5) * 50
        positions[i3 + 2] = (Math.random() - 0.5) * 50

        randomness[i3] = Math.random() * 2 - 1
        randomness[i3 + 1] = Math.random() * 2 - 1
        randomness[i3 + 2] = Math.random() * 2 - 1

        const color = palette[Math.floor(Math.random() * palette.length)]
        colors[i3] = color.r
        colors[i3 + 1] = color.g
        colors[i3 + 2] = color.b

        sizes[i] = Math.random() * 2 + 0.5
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
      geometry.setAttribute("randomness", new THREE.BufferAttribute(randomness, 3))

      const material = new THREE.ShaderMaterial({
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          attribute vec3 randomness;
          varying vec3 vColor;
          uniform float uTime;
          uniform float uSize;

          void main() {
            vColor = color;
            vec3 pos = position;
            pos.x += sin(uTime * 0.3 + pos.x * 0.2) * randomness.x * 0.5;
            pos.y += cos(uTime * 0.2 + pos.y * 0.3) * randomness.y * 0.5;
            pos.z += sin(uTime * 0.1 + pos.z * 0.4) * randomness.z * 0.5;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size * uSize * (1.0 / -mvPosition.z);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
            vec3 glow = vColor * (1.0 - dist * 2.0);
            gl_FragColor = vec4(glow, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 30 },
        },
      })

      const particles = new THREE.Points(geometry, material)
      sceneRef.current?.add(particles)
      particlesRef.current = particles
    }

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return
      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    const animate = () => {
      const elapsed = clockRef.current.getElapsedTime()
      if (
        particlesRef.current &&
        cameraRef.current &&
        sceneRef.current &&
        rendererRef.current
      ) {
        const material = particlesRef.current.material as THREE.ShaderMaterial
        material.uniforms.uTime.value = elapsed
        particlesRef.current.rotation.x = elapsed * 0.05
        particlesRef.current.rotation.y = elapsed * 0.03
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }

      animationFrameId.current = requestAnimationFrame(animate)
    }

    initThree()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId.current)

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }

      if (particlesRef.current) {
        particlesRef.current.geometry.dispose()
        const material = particlesRef.current.material as THREE.Material
        material.dispose()
      }
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 z-[-1]" />
}
