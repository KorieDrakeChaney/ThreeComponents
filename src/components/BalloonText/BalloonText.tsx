import * as React from "react";
import { useGLTF } from "@react-three/drei";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { MutableRefObject,  useEffect, useRef, useMemo } from "react";
import { BufferGeometry, Group, InstancedMesh,  Matrix4,  MeshStandardMaterial, Object3D, Vector3 } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Alphabet, letters } from "./utils";

import vertexShader from "../../shaders/balloonText/vertex.glsl"
import fragmentShader from "../../shaders/balloonText/fragment.glsl"


type BalloonTextProps = {
  text?: string;
  color?: string;
  position?: [number, number, number];
  rotation?:[number, number, number];
  scale?: number;
  line?: number;
  bounce?: boolean; 
};

const BalloonText = ({
  text = "",
  position = [0, 0, 0],
  color = "0xffffff",
  scale = 1,
  bounce = false,
  rotation = [Math.PI / 2, Math.PI, Math.PI],
  ...props
}: BalloonTextProps) => {
  const balloonTextFBX = useGLTF("./assets/models/BalloonText.glb") as GLTF & {
    nodes: any;
  };

  const balloonTextRef = useRef() as MutableRefObject<Group>;

  const model = useMemo(() => {
    const meshes : InstancedMesh[] = [];
    const matrixArray : Record<Alphabet, Matrix4[]> = {
      A: [],
      B: [],
      C: [],
      D: [],
      E: [],
      F: [],
      G: [],
      H: [],
      I: [],
      J: [],
      K: [],
      L: [],
      M: [],
      N: [],
      O: [],
      P: [],
      Q: [],
      R: [],
      S: [],
      T: [],
      U: [],
      V: [],
      W: [],
      X: [],
      Y: [],
      Z: [],
    };
    let letterRegex = /^[a-zA-Z]+$/;
    let centerArray: number[] = [];
    let offsetArray : {letter : Alphabet, line : number, offset: [number, number, number]}[] = [];
    let spaceBoundingBox = balloonTextFBX.nodes["A"].geometry.boundingBox;
    let space = (spaceBoundingBox.max.z - spaceBoundingBox.min.z)
    let lines = text.split("\n");
    let prevValue = 0;

    lines.forEach((line, lineIndex) => {
      prevValue = 0;
      let words = line.split(" ");
      for (const word of words) {
        for (let i = 0; i < word.length; i++) {
          if (word[i].match(letterRegex)) {
            let boundingBox = balloonTextFBX.nodes[word[i].toUpperCase()].geometry.boundingBox;
            
            offsetArray.push({letter : word[i].toUpperCase() as Alphabet, line : lineIndex, offset : [prevValue, -space * lineIndex, 0]});
            prevValue +=
            (boundingBox.max.z - boundingBox.min.z)
          }
        }
        prevValue += space;
      }
      centerArray.push(prevValue / 2);
    });

    for(let i = 0; i < offsetArray.length; i++){
      const object = new Object3D();
      object.position.copy(
        new Vector3()
        .fromArray(offsetArray[i].offset)
        .sub(new Vector3(centerArray[offsetArray[i].line], 0, 0))
        .add(new Vector3().fromArray(position)))
      object.rotation.fromArray(rotation)
      object.updateMatrixWorld();
      matrixArray[offsetArray[i].letter].push(object.matrix);
    }

    letters.forEach((value) => {
      let geometry : BufferGeometry = balloonTextFBX.nodes[value].geometry;
      geometry.center();
      let instancedMesh = new InstancedMesh(geometry, new MeshStandardMaterial({color,}), matrixArray[value].length);
      for(let j = 0; j < matrixArray[value].length; j++){
        instancedMesh.setMatrixAt(j, matrixArray[value][j]);
      }
      instancedMesh.scale.multiplyScalar(scale);
      meshes.push(instancedMesh);
    })
    return meshes;
  }, [balloonTextFBX, text]);

  useEffect(() => {
    model.forEach((value) => {
      (value.material as 
        MeshStandardMaterial).color.set(color)
    })
  }, [color])

  useEffect(() => {
    model.forEach((value) => {
      value.scale.set(1, 1, 1).multiplyScalar(scale);
      value.updateMatrixWorld();
    })
  }, [scale])

  useFrame(({ clock }) => {
    if (bounce)
      balloonTextRef.current.scale.x = Math.max(
        0.5,
        ((Math.sin(clock.getElapsedTime()) + 1) / 2) * 0.5 + 0.5
      );
  });

  return (
    <group ref={balloonTextRef}>
      {text &&
        Array.from({ length: model.length }, (_, i) => (
          <primitive
            {...props}
            object={model[i]} 
            key={i}
          />
        ))}
    </group>
  );
};

export default BalloonText;
