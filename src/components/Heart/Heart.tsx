import * as React from 'react'
import { useFBX } from '@react-three/drei'
import { ThreeElements, useFrame } from '@react-three/fiber'
import { MutableRefObject, useEffect, useMemo, useRef } from 'react'
import { BufferGeometry, Color, Mesh, MeshPhongMaterial } from 'three'
import { LoopSubdivision } from 'three-subdivide'

export type HeartProps = ThreeElements['mesh'] & {
  color?: string
  rotate?: boolean
}

const Heart = ({
  color,
  scale,
  rotate = true,
  rotation = [Math.PI * 2 - Math.PI / 2, 0, Math.PI / 2],
  ...props
}: HeartProps) => {
  const heartFBX = useFBX('./assets/models/Heart.fbx')
  const heartRef = useRef() as MutableRefObject<Mesh>
  const model: BufferGeometry = useMemo(() => {
    const mesh = heartFBX.clone(true).children[1]
    ;(mesh as Mesh).geometry.center
    return (mesh as Mesh).geometry
  }, [heartFBX])
  useEffect(() => {
    if (heartRef) {
      ;(heartRef.current as Mesh).material = new MeshPhongMaterial({
        color: new Color(color ?? '#e12222'),
      })
    }
  }, [heartRef, color])

  useEffect(() => {
    if (heartRef) {
      ;(heartRef.current as Mesh).geometry = LoopSubdivision.modify((heartRef.current as Mesh).geometry, 2)
    }
  }, [heartRef])

  useFrame((state, delta) => (heartRef.current.rotation.z += rotate ? delta : 0))

  return <mesh {...props} ref={heartRef} geometry={model} scale={scale} rotation={rotation} />
}

export default Heart
