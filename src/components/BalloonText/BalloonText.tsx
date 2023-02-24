import * as React from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { MutableRefObject, useEffect, useRef, useMemo, useState } from 'react'
import { BufferGeometry, Group, InstancedMesh, MeshStandardMaterial, Object3D, Vector3 } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { Alphabet, AlphabetIndex, letters } from './utils'

export type BalloonTextProps = {
  text?: string
  color?: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  line?: number
  bounce?: boolean
}

const BalloonText = ({
  text = '',
  position = [0, 0, 0],
  color = '0xffffff',
  scale = 1,
  bounce = false,
  rotation = [Math.PI / 2, Math.PI, Math.PI],
  ...props
}: BalloonTextProps) => {
  const balloonTextGLTF = useGLTF('./assets/models/BalloonText.glb') as GLTF & {
    nodes: any
  }

  const balloonTextRef = useRef() as MutableRefObject<Group>
  const [balloonStructure, setBalloonStructure] = useState<Group[]>()
  const [center, setCenter] = useState<number[]>([])
  const letterCount: Record<Alphabet, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
    J: 0,
    K: 0,
    L: 0,
    M: 0,
    N: 0,
    O: 0,
    P: 0,
    Q: 0,
    R: 0,
    S: 0,
    T: 0,
    U: 0,
    V: 0,
    W: 0,
    X: 0,
    Y: 0,
    Z: 0,
  }

  const model = useMemo(() => {
    const meshes: InstancedMesh[] = []

    let letterRegex = /^[a-zA-Z]+$/
    let centerArray: number[] = []
    let spaceBoundingBox = balloonTextGLTF.nodes['A'].geometry.boundingBox
    let space = spaceBoundingBox.max.z - spaceBoundingBox.min.z
    let lines = text.split('\n')
    let prevValue = 0
    const balloons: Group[] = []
    const letterGeoms: BufferGeometry[] = []
    lines.forEach((line, lineIndex) => {
      prevValue = 0
      let words = line.split(' ')
      for (const word of words) {
        for (let i = 0; i < word.length; i++) {
          if (word[i].match(letterRegex)) {
            let boundingBox = balloonTextGLTF.nodes[word[i].toUpperCase()].geometry.boundingBox
            const structure = new Group()
            structure.userData = {
              letter: word[i].toUpperCase() as Alphabet,
              line: lineIndex,
              offset: [prevValue, -space * lineIndex, 0],
              index: letterCount[word[i].toUpperCase() as Alphabet],
            }
            letterCount[word[i].toUpperCase() as Alphabet]++
            structure.add(new Object3D())
            balloons.push(structure)
            letterGeoms.push(balloonTextGLTF.nodes[word[i].toUpperCase()].geometry)
            prevValue += boundingBox.max.z - boundingBox.min.z
          }
        }
        prevValue += space
      }
      centerArray.push(prevValue / 2)
    })

    setCenter(centerArray)
    setBalloonStructure(balloons)

    letters.forEach((value) => {
      let geometry: BufferGeometry = balloonTextGLTF.nodes[value].geometry
      geometry.center()
      let instancedMesh = new InstancedMesh(geometry, new MeshStandardMaterial({ color }), letterCount[value])
      meshes.push(instancedMesh)
    })

    return meshes
  }, [balloonTextGLTF, text])

  useEffect(() => {
    balloonStructure?.forEach((balloon, index) => {
      balloon.scale.set(1, 1, 1).multiplyScalar(scale)
      const oldOffset = balloon.userData.offset
      const newOffset = [oldOffset[0] * scale, oldOffset[1] * scale, oldOffset[2] * scale]
      balloon.position.copy(
        new Vector3()
          .fromArray(newOffset)
          .sub(new Vector3(center[balloon.userData.line] * scale, 0, 0))
          .add(new Vector3().fromArray(position))
      )
      balloon.rotation.fromArray(rotation)
      balloon.updateMatrixWorld()

      model[AlphabetIndex[balloon.userData.letter]].setMatrixAt(balloon.userData.index, balloon.matrix)
    })
    model.forEach((value) => {
      value.instanceMatrix.needsUpdate = true
    })
  }, [balloonStructure, scale])

  useEffect(() => {
    model.forEach((value) => {
      ;(value.material as MeshStandardMaterial).color.set(color)
    })
  }, [color])

  useFrame(({ clock }) => {
    if (bounce) balloonTextRef.current.scale.x = Math.max(0.5, ((Math.sin(clock.getElapsedTime()) + 1) / 2) * 0.5 + 0.5)
  })

  return (
    <group ref={balloonTextRef}>
      {text && Array.from({ length: model.length }, (_, i) => <primitive {...props} object={model[i]} key={i} />)}
    </group>
  )
}

export default BalloonText
