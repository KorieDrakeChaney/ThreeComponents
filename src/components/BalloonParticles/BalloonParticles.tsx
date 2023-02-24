import * as React from 'react'
import { useGLTF } from '@react-three/drei'
import { useMemo, useEffect, useState } from 'react'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { Color, Group, InstancedMesh, MeshStandardMaterial, Object3D, Vector3 } from 'three'
import { BalloonMode, BALLOONS, BalloonType } from './utils'
import { useFrame } from '@react-three/fiber'

export type BalloonParticlesProps = {
  scale?: number
  rotation?: [number, number, number]
  color?: string
  count?: number
  mode?: BalloonMode
  radius?: number
  balloonType?: BalloonType
  speed?: number
}

const BalloonParticles = ({
  mode = 'Circular',
  count = 10000,
  speed = 0.05,
  scale = 1,
  radius = 20,
  color = '0xffffff',
  rotation = [Math.PI / 2, Math.PI, Math.PI],
  balloonType = 'Basic',
}: BalloonParticlesProps) => {
  const BalloonsGLTF = useGLTF('./assets/models/Balloons.glb') as GLTF & {
    nodes: any
  }

  const model = useMemo(() => {
    const balloons: Group[] = []
    for (let i = 0; i < count; i++) {
      const structure = new Group()
      structure.userData = {
        speed: Math.random() * speed + 0.01,
        height: -100 + Math.random() * 200,
        phase: Math.PI * 2 * Math.random(),
        startingPosition: new Vector3(),
        origin: new Vector3(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5),
        radius: Math.random() * radius + radius / 2,
      }
      const object = new Object3D()
      object.scale.normalize().multiplyScalar(scale)
      object.updateMatrixWorld(true)
      structure.add(object)
      balloons.push(structure)
    }

    return balloons
  }, [count])

  useEffect(() => {
    mesh.count = count
  }, [count])

  const mesh = useMemo(() => {
    const geometry = BalloonsGLTF.nodes[balloonType].geometry
    geometry.center()
    const mesh = new InstancedMesh(geometry, new MeshStandardMaterial({ color: new Color(color) }), count)
    model.forEach((balloonObject, index) => {
      mesh.setMatrixAt(index, balloonObject.matrixWorld)
    })
    mesh.instanceMatrix.needsUpdate = true
    return mesh
  }, [BalloonsGLTF, balloonType])

  useEffect(() => {
    ;(mesh.material as MeshStandardMaterial).color.set(color)
  }, [color])

  useEffect(() => {
    model.forEach((balloonObject, index) => {
      balloonObject.scale.set(1, 1, 1).multiplyScalar(scale)
      balloonObject.updateMatrixWorld(true)
      mesh.setMatrixAt(index, balloonObject.matrixWorld)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [scale, count])

  useEffect(() => {
    model.forEach((balloonObject) => {
      const normalRadius = balloonObject.userData.radius / Math.sqrt(Math.pow(balloonObject.userData.radius, 2))
      const newRadius = normalRadius * radius
      balloonObject.userData.radius = newRadius
      balloonObject.userData.startingPosition.copy(balloonObject.userData.origin).multiplyScalar(radius)
    })
  }, [radius, count])

  useEffect(() => {
    model.forEach((balloonObject) => {
      const normalSpeed = balloonObject.userData.speed / Math.sqrt(Math.pow(balloonObject.userData.speed, 2))
      const newSpeed = normalSpeed * (speed + 0.01)
      balloonObject.userData.speed = newSpeed
    })
  }, [speed])

  useFrame(({ clock }) => {
    let t = clock.getElapsedTime()
    let d = clock.getDelta()
    model.forEach((balloonObject, index) => {
      switch (mode) {
        case 'Circular':
          {
            const angle = t * balloonObject.userData.speed + balloonObject.userData.phase
            balloonObject.position
              .set(Math.cos(angle), 0, Math.sin(angle))
              .multiplyScalar(balloonObject.userData.radius)
              .setY(balloonObject.userData.height)
            balloonObject.rotation.y = -angle
            balloonObject.updateMatrixWorld(true)
          }
          break
        case 'Regular':
          {
            balloonObject.position
              .set(
                balloonObject.userData.startingPosition.x,
                balloonObject.userData.startingPosition.y,
                balloonObject.userData.startingPosition.z
              )
              .applyAxisAngle(new Vector3(1, 1, 1), -balloonObject.rotation.y * balloonObject.userData.speed)
            balloonObject.rotation.set(
              0,
              Math.max((Math.sin(clock.getElapsedTime() + balloonObject.userData.phase) + 1) / 2, 0),
              0.5
            )
            balloonObject.updateMatrixWorld(true)
          }
          break
      }

      mesh.setMatrixAt(index, balloonObject.matrixWorld)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <primitive object={mesh} rotation={rotation} />
    </group>
  )
}

export default BalloonParticles
