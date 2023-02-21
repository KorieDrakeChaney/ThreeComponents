import * as React from "react";
import { Euler, Vector3 } from "three";
import { ComponentStory } from "@storybook/react";

import { Heart, Scene } from "..";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Shapes/Heart",
  component: Heart,

  argTypes: {
    color: {
      control: { type: "color" },
    },
    scale: {
      control: { type: "range", min: 0, max: 100, step: 0.1 },
    },
    rotate: {
      control: { type: "boolean" },
    },
  },
};

type DefaultHeartProps = {
  color: string;
  scale: number;
  rotate: boolean;
};

const DefaultHeart = ({ color, scale, rotate }: DefaultHeartProps) => {
  return (
    <>
      <Scene>
        <Heart color={color} scale={scale} rotate={rotate} />
      </Scene>
    </>
  );
};

const Template: ComponentStory<typeof DefaultHeart> = (props) => (
  <DefaultHeart {...props} />
);

export const Default = Template.bind({});
Default.args = {
  scale: 1,
  color: "#e12222",
  rotate: false,
};
