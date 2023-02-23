import * as React from "react";
import { ComponentStory } from "@storybook/react";

import { BalloonParticles, Scene } from "../components";
import { NODEFAULTCONTROLS, STATSOPTION, statTypes, statValues } from "./utils";
import { Stats } from "@react-three/drei";
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Componets/BalloonParticles",
  component: BalloonParticles,

  argTypes: {
    scale: {
      control: { type: "range", min: 0, max: 10, step: 0.1 },
    },
    color: {
      control: { type: "color" },
    },
    count: {
      control: { type: "range", min: 1, max: 10000, step: 1 },
    },
    ...STATSOPTION,
    ...NODEFAULTCONTROLS["MESH"]
  },
};

type DefaultBalloonParticlesProps = {
  scale: number;
  color: string;
  count: number;
  stats: statTypes;
};

const DefaultBalloonParticles = ({
  scale,
  stats,
  color, 
  count
}: DefaultBalloonParticlesProps) => {
  return (
    <>
      <Scene>
        <Stats showPanel={statValues[stats]}/>
        <BalloonParticles
          scale={scale}
          color={color}
          count={count}
        />
      </Scene>
    </>
  );
};

const Template: ComponentStory<typeof DefaultBalloonParticles> = (props) => (
  <DefaultBalloonParticles {...props} />
);

export const Default = Template.bind({});
Default.args = {
  stats: "NONE",
  scale: 1,
  color: "#f63b3b",
  count: 100,
};
