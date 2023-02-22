import * as React from "react";
import { ComponentStory } from "@storybook/react";

import { BalloonText, Scene } from "../components";
import { NODEFAULTCONTROLS, STATSOPTION, statTypes, statValues } from "./utils";
import { Stats } from "@react-three/drei";
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Componets/BalloonText",
  position: [0, -2.5, -10],
  rotation: [-90, 0, 0],
  bounce: false,
  component: BalloonText,

  argTypes: {
    scale: {
      control: { type: "range", min: 0, max: 100, step: 0.1 },
    },
    text: {
      control: { type: "text" },
    },
    bounce: {
      control: { type: "boolean" },
    },
    ...STATSOPTION,
    ...NODEFAULTCONTROLS["MESH"]
  },
};

type DefaultBalloonTextProps = {
  color: string;
  scale: number;
  text: string;
  bounce: boolean;
  stats: statTypes;
};

const DefaultBalloonText = ({
  color,
  scale,
  text,
  bounce,
  stats
}: DefaultBalloonTextProps) => {
  return (
    <>
      <Scene>
        <Stats showPanel={statValues[stats]}/>
        <BalloonText
          scale={scale}
          text={text}
          color={color}
          bounce={bounce}
          position={[0, 0, -5]}
        />
      </Scene>
    </>
  );
};

const Template: ComponentStory<typeof DefaultBalloonText> = (props) => (
  <DefaultBalloonText {...props} />
);

export const Default = Template.bind({});
Default.args = {
  stats: "NONE",
  color: "#e12222",
  scale: 1,
  text: "Hello World",
  bounce: true,
};
