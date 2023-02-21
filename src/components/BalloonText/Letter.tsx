import * as React from "react";
import { ThreeElements } from "@react-three/fiber";
import { useEffect } from "react";
import {
  Color,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
} from "three";
import { Alphabet } from "./utils";

type LetterProps = ThreeElements["mesh"] & {
  color?: string;
};

const Letter = ({
  geometry,
  color,
  scale,
  rotation,
  ...props
}: LetterProps) => {
  const material = new MeshPhongMaterial({
    color: new Color(color ?? "#cc395c"),
  });
  return (
    <mesh
      geometry={geometry}
      {...props}
      material={material}
      scale={scale}
      rotation={rotation ?? [Math.PI / 2, Math.PI, Math.PI]}
    />
  );
};

export default Letter;
