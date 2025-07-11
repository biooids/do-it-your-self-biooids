// =================================================================
// FILE: src/components/landing/HeroAnimation.tsx (CURSOR INTERACTIVE)
// =================================================================
"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroAnimation() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Capture the current mount point at the start of the effect
    const currentMount = mountRef.current;
    if (!currentMount || typeof window === "undefined") return;

    let scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      renderer: THREE.WebGLRenderer;
    let particles1: THREE.Points, particles2: THREE.Points;
    let velocities1: Float32Array, velocities2: Float32Array;
    const clock = new THREE.Clock();
    const mouse = new THREE.Vector2(-100, -100);
    const mouseWorldPosition = new THREE.Vector3();

    const createCircleTexture = (color: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const context = canvas.getContext("2d");
      if (!context) return null;

      const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(
        0,
        `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
          color.slice(3, 5),
          16
        )}, ${parseInt(color.slice(5, 7), 16)}, 1)`
      );
      gradient.addColorStop(
        0.2,
        `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
          color.slice(3, 5),
          16
        )}, ${parseInt(color.slice(5, 7), 16)}, 0.8)`
      );
      gradient.addColorStop(
        0.5,
        `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
          color.slice(3, 5),
          16
        )}, ${parseInt(color.slice(5, 7), 16)}, 0.3)`
      );
      gradient.addColorStop(1, "rgba(0,0,0,0)");

      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);

      return new THREE.CanvasTexture(canvas);
    };

    const init = () => {
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0a0a1a, 0.0008);

      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        3000
      );
      camera.position.z = 1000;

      const particleCount = 3000;
      const positions = new Float32Array(particleCount * 3);
      velocities1 = new Float32Array(particleCount * 3);
      velocities2 = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = Math.random() * 2500 - 1250;
        positions[i3 + 1] = Math.random() * 2500 - 1250;
        positions[i3 + 2] = Math.random() * 2500 - 1250;

        velocities1[i3] = (Math.random() - 0.5) * 10;
        velocities1[i3 + 1] = (Math.random() - 0.5) * 10;
        velocities1[i3 + 2] = (Math.random() - 0.5) * 10;

        velocities2[i3] = (Math.random() - 0.5) * 5;
        velocities2[i3 + 1] = (Math.random() - 0.5) * 5;
        velocities2[i3 + 2] = (Math.random() - 0.5) * 5;
      }

      const createParticleSystem = (color: string, baseSize: number) => {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions.slice(), 3)
        );
        const material = new THREE.PointsMaterial({
          map: createCircleTexture(color),
          size: baseSize,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
          sizeAttenuation: true,
        });
        return new THREE.Points(geometry, material);
      };

      particles1 = createParticleSystem("#00c4ff", 20);
      particles2 = createParticleSystem("#ff00c4", 15);
      scene.add(particles1, particles2);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      currentMount.appendChild(renderer.domElement);

      document.addEventListener("mousemove", onDocumentMouseMove, false);
      window.addEventListener("resize", onWindowResize, false);
    };

    const updateParticles = (
      particleSystem: THREE.Points,
      velocities: Float32Array,
      deltaTime: number,
      params: {
        gravity: number;
        spin: number;
        damping: number;
        repulsion: number;
      }
    ) => {
      const positions = (
        particleSystem.geometry.attributes.position as THREE.BufferAttribute
      ).array as Float32Array;
      const particleCount = positions.length / 3;
      const blackHolePos = new THREE.Vector3(0, 0, 0);
      const spinAxis = new THREE.Vector3(0, 1, 0);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const pos = new THREE.Vector3(
          positions[i3],
          positions[i3 + 1],
          positions[i3 + 2]
        );
        const vel = new THREE.Vector3(
          velocities[i3],
          velocities[i3 + 1],
          velocities[i3 + 2]
        );
        const toBlackHole = new THREE.Vector3().subVectors(blackHolePos, pos);
        const distanceToBlackHoleSq = Math.max(toBlackHole.lengthSq(), 50);

        if (distanceToBlackHoleSq < 250) {
          const r = 1200 + Math.random() * 500;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          pos.setFromSphericalCoords(r, phi, theta);
          vel.set(0, 0, 0);
        } else {
          const gravity = toBlackHole
            .normalize()
            .multiplyScalar(params.gravity / distanceToBlackHoleSq);
          const posNormalized = pos.clone().normalize();
          const spin = new THREE.Vector3()
            .crossVectors(posNormalized, spinAxis)
            .multiplyScalar(
              (params.spin / Math.max(distanceToBlackHoleSq, 1000)) * 50
            );
          const acceleration = gravity.add(spin);
          const toMouse = new THREE.Vector3().subVectors(
            pos,
            mouseWorldPosition
          );
          const mouseDistanceSq = toMouse.lengthSq();

          if (mouseDistanceSq < params.repulsion * params.repulsion) {
            const repulsionForce = toMouse
              .normalize()
              .multiplyScalar(
                (params.repulsion * 10000) / (mouseDistanceSq + 0.0001)
              );
            acceleration.add(repulsionForce);
          }

          vel.add(acceleration.multiplyScalar(deltaTime));
          vel.multiplyScalar(params.damping);
        }

        pos.add(vel.clone().multiplyScalar(deltaTime));
        positions[i3] = pos.x;
        positions[i3 + 1] = pos.y;
        positions[i3 + 2] = pos.z;
        velocities[i3] = vel.x;
        velocities[i3 + 1] = vel.y;
        velocities[i3 + 2] = vel.z;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;
    };

    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };

    const render = () => {
      const deltaTime = clock.getDelta();
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      mouseWorldPosition
        .copy(camera.position)
        .add(dir.multiplyScalar(distance));

      updateParticles(particles1, velocities1, deltaTime, {
        gravity: 40000,
        spin: 70000,
        damping: 0.99,
        repulsion: 150,
      });
      updateParticles(particles2, velocities2, deltaTime, {
        gravity: 60000,
        spin: 50000,
        damping: 0.995,
        repulsion: 150,
      });

      scene.rotation.y += deltaTime * 0.05;
      renderer.render(scene, camera);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const onDocumentMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    init();
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize);
      document.removeEventListener("mousemove", onDocumentMouseMove);

      // Use the captured 'currentMount' variable for safe cleanup
      if (currentMount && renderer.domElement) {
        if (currentMount.contains(renderer.domElement)) {
          currentMount.removeChild(renderer.domElement);
        }
      }

      scene.traverse((object) => {
        if (object instanceof THREE.Points) {
          if (object.geometry) object.geometry.dispose();
          if (object.material instanceof THREE.PointsMaterial) {
            if (object.material.map) object.material.map.dispose();
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 -z-10 h-full w-full " />
  );
}
