import * as React from "react";
import { useGLTF } from "@react-three/drei";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { BufferGeometry, Group, Vector3 } from "three";
import Letter from "./Letter";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Alphabet, letters, LetterOffset } from "./utils";

type BalloonTextProps = ThreeElements["mesh"] & {
  text?: string;
  color?: string;
  position?: [number, number, number];
  scale?: number;
  line?: number;
  bounce?: boolean;
};

const BalloonText = ({
  text = "",
  position = [0, 0, 0],
  color,
  scale = 1,
  rotation,
  bounce = false,
  ...props
}: BalloonTextProps) => {
  const balloonTextFBX = useGLTF("./assets/models/BalloonText.glb") as GLTF & {
    nodes: any;
  };

  const balloonTextRef = useRef() as MutableRefObject<Group>;

  const [letterOffset, setLetterOffset] = useState<LetterOffset[]>([]);
  const [center, setCenter] = useState<number[]>([]);
  //   const [balloonGeometry, setBalloonGeometry] = useState<BufferGeometry>();

  const modelGeometry = useMemo(() => {
    const geometries: Record<Alphabet, BufferGeometry | undefined> = {
      A: undefined,
      B: undefined,
      C: undefined,
      D: undefined,
      E: undefined,
      F: undefined,
      G: undefined,
      H: undefined,
      I: undefined,
      J: undefined,
      K: undefined,
      L: undefined,
      M: undefined,
      N: undefined,
      O: undefined,
      P: undefined,
      Q: undefined,
      R: undefined,
      S: undefined,
      T: undefined,
      U: undefined,
      V: undefined,
      W: undefined,
      X: undefined,
      Y: undefined,
      Z: undefined,
    };
    letters.forEach((value) => {
      const geometry = balloonTextFBX.nodes[value].geometry;
      geometry.center();
      geometries[value] = geometry;
    });
    return geometries;
  }, [balloonTextFBX]);

  useEffect(() => {
    let letterRegex = /^[a-zA-Z]+$/;
    let letterOffset: LetterOffset[] = [];
    let prevValue: number = 0;
    let spaceBoundingBox = modelGeometry["A"]!.boundingBox;
    let space =
      Math.abs(spaceBoundingBox!.min.z * (scale as number)) +
      Math.abs(spaceBoundingBox!.max.z * (scale as number));
    let newCenter: number[] = [];
    let lines = text.split("\n");
    lines.forEach((line, lineIndex) => {
      prevValue = 0;
      let words = line.split(" ");
      for (const word of words) {
        for (let i = 0; i < word.length; i++) {
          if (word[i].match(letterRegex)) {
            let boundingBox =
              modelGeometry[word[i].toUpperCase() as Alphabet]?.boundingBox;
            let offset: [number, number, number] = [
              prevValue,
              -space * lineIndex,
              0,
            ];
            letterOffset.push({
              offset: offset,
              line: lineIndex,
              letter: word[i].toUpperCase() as Alphabet,
            });
            prevValue +=
              Math.abs(boundingBox!.min.z * (scale as number)) +
              Math.abs(boundingBox!.max.z * (scale as number));
          } else {
          }
        }
        prevValue += space;
      }
      newCenter.push(prevValue / 2);
    });

    setCenter(newCenter);
    setLetterOffset(letterOffset);
  }, [modelGeometry, text, scale]);

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
        Array.from({ length: letterOffset.length }, (_, i) => (
          <Letter
            scale={scale}
            position={new Vector3()
              .fromArray(letterOffset[i].offset)
              .sub(new Vector3(center[letterOffset[i].line], 0, 0))
              .add(new Vector3().fromArray(position))}
            geometry={modelGeometry[letterOffset[i].letter]}
            color={color}
            key={i}
          />
        ))}
    </group>
  );
};

export default BalloonText;
