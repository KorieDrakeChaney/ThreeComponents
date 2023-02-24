import * as React from 'react'
import { useGLTF } from '@react-three/drei'
import { useMemo, useEffect, useState } from 'react'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  Color,
  Group,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
} from 'three'
import { BALLOONS, BalloonType } from './utils'
import { useFrame } from '@react-three/fiber'

type BalloonParticlesType = {
  scale?: number
  rotation?: [number, number, number]
  color?: string
  count?: number
}

const BalloonParticles = ({
  count = 10000,
  scale = 1,
  color = '0xffffff',
  rotation = [Math.PI / 2, Math.PI, Math.PI],
}: BalloonParticlesType) => {
  const [balloonStructure, setBalloonStructure] = useState<Group[]>()
  const BalloonsGLTF = useGLTF('./assets/models/balloons.glb') as GLTF & {
    nodes: any
  }

  const model = useMemo(() => {
    const balloons: Group[] = []
    for (let i = 0; i < count; i++) {
      const structure = new Group()
      structure.userData = {
        speed: Math.random() * 0.05 + 0.01,
        height: -100 + Math.random() * 200,
        phase: Math.PI * 2 * Math.random(),
        radius: Math.random() * 10 + 20,
      }
      const object = new Object3D()
      structure.add(object)
      balloons.push(structure)
    }
    setBalloonStructure(balloons)

    const geometry = BalloonsGLTF.nodes['Tube'].geometry
    geometry.center()
    return new InstancedMesh(geometry, new MeshStandardMaterial({ color: new Color(color) }), count)
  }, [BalloonsGLTF, count])

  useEffect(() => {
    ;(model.material as MeshStandardMaterial).color.set(color)
  }, [color])

  useEffect(() => {
    balloonStructure?.forEach((balloonObject, index) => {
      balloonObject.scale.set(1, 1, 1).multiplyScalar(scale)
      model.setMatrixAt(index, balloonObject.matrix)
    })
    model.instanceMatrix.needsUpdate = true
  }, [scale])

  useFrame(({ clock }) => {
    let t = clock.getElapsedTime()
    balloonStructure?.forEach((balloonObject, index) => {
      const angle = t * balloonObject.userData.speed + balloonObject.userData.phase
      balloonObject.position
        .set(Math.cos(angle), 0, Math.sin(angle))
        .multiplyScalar(balloonObject.userData.radius)
        .setY(balloonObject.userData.height)
      balloonObject.rotation.y = -angle
      balloonObject.updateMatrixWorld(true)

      model.setMatrixAt(index, balloonObject.children[0].matrixWorld)
    })
    model.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <primitive object={model} rotation={rotation} />
    </group>
  )
}

export default BalloonParticles
