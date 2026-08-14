'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const LAYER_COUNTS = [8, 14, 16, 12, 6]
const LAYER_SPACING = 2.6
const CYAN = 0x67e8f9
const VIOLET = 0xa78bfa

function makeGlowTexture(): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.55)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  return tex
}

/**
 * Layered "neural field" — a rotating 3D node network with pulses traveling
 * along edges, replacing the mockup's hand-rolled 2D-canvas projection with
 * a real three.js scene.
 */
export default function Hero3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 13)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    const group = new THREE.Group()
    group.position.set(2.6, 0.3, 0)
    scene.add(group)

    const glowTex = makeGlowTexture()

    type NodeInfo = { pos: THREE.Vector3; accent: boolean }
    const nodes: NodeInfo[] = []
    const layerStart: number[] = []
    let idx = 0
    LAYER_COUNTS.forEach((n, li) => {
      layerStart.push(idx)
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + li
        const r = 1.1 + Math.random() * 1.7
        const x = (li - 2) * LAYER_SPACING
        const y = Math.cos(a) * r * 0.9 + (Math.random() - 0.5) * 0.6
        const z = Math.sin(a) * r
        nodes.push({ pos: new THREE.Vector3(x, y, z), accent: Math.random() < 0.25 })
        idx++
      }
    })

    const edges: [number, number][] = []
    for (let li = 1; li < LAYER_COUNTS.length; li++) {
      for (let i = 0; i < LAYER_COUNTS[li]; i++) {
        const to = layerStart[li] + i
        const links = 2 + (Math.random() < 0.4 ? 1 : 0)
        for (let k = 0; k < links; k++) {
          const from = layerStart[li - 1] + Math.floor(Math.random() * LAYER_COUNTS[li - 1])
          edges.push([from, to])
        }
      }
    }

    const linePositions = new Float32Array(edges.length * 2 * 3)
    edges.forEach(([a, b], i) => {
      linePositions[i * 6] = nodes[a].pos.x
      linePositions[i * 6 + 1] = nodes[a].pos.y
      linePositions[i * 6 + 2] = nodes[a].pos.z
      linePositions[i * 6 + 3] = nodes[b].pos.x
      linePositions[i * 6 + 4] = nodes[b].pos.y
      linePositions[i * 6 + 5] = nodes[b].pos.z
    })
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    const lineMat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.14 })
    const lines = new THREE.LineSegments(lineGeo, lineMat)
    group.add(lines)

    const nodeSprites: THREE.Sprite[] = []
    nodes.forEach((n) => {
      const mat = new THREE.SpriteMaterial({
        map: glowTex,
        color: n.accent ? VIOLET : CYAN,
        transparent: true,
        opacity: n.accent ? 0.85 : 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const sprite = new THREE.Sprite(mat)
      const scale = n.accent ? 0.22 : 0.16
      sprite.scale.set(scale, scale, 1)
      sprite.position.copy(n.pos)
      group.add(sprite)
      nodeSprites.push(sprite)
    })

    const pulseCount = 26
    const pulses = Array.from({ length: pulseCount }, () => {
      const core = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTex,
          color: 0xc4b5fd,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      )
      core.scale.set(0.14, 0.14, 1)
      const halo = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTex,
          color: VIOLET,
          transparent: true,
          opacity: 0.25,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      )
      halo.scale.set(0.36, 0.36, 1)
      group.add(halo)
      group.add(core)
      return {
        core,
        halo,
        edge: Math.floor(Math.random() * edges.length),
        t: Math.random(),
        speed: 0.15 + Math.random() * 0.3,
      }
    })

    let raf = 0
    const clock = new THREE.Clock()

    function onScroll() {
      if (!mount) return
      const s = window.scrollY || 0
      mount.style.transform = `translateY(${(s * 0.15).toFixed(1)}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    function animate() {
      raf = requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.05)
      group.rotation.y += dt * 0.12

      pulses.forEach((p) => {
        p.t += p.speed * dt
        if (p.t > 1) {
          p.t = 0
          p.edge = Math.floor(Math.random() * edges.length)
        }
        const [a, b] = edges[p.edge]
        p.core.position.lerpVectors(nodes[a].pos, nodes[b].pos, p.t)
        p.halo.position.copy(p.core.position)
      })

      renderer.render(scene, camera)
    }
    animate()

    const ro = new ResizeObserver(() => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    })
    ro.observe(mount)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      renderer.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      glowTex.dispose()
      nodeSprites.forEach((s) => (s.material as THREE.SpriteMaterial).dispose())
      pulses.forEach((p) => {
        ;(p.core.material as THREE.SpriteMaterial).dispose()
        ;(p.halo.material as THREE.SpriteMaterial).dispose()
      })
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className="hero-canvas" />
}
