import * as React from "react";
import { ComponentStory } from "@storybook/react";

import { BalloonText, Scene } from "../components";
import { NODEFAULTCONTROLS } from "./utils";
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
    stats:{
      control: { type: "boolean"}
    },
    ...NODEFAULTCONTROLS["MESH"]
  },
};

type DefaultBalloonTextProps = {
  color: string;
  scale: number;
  text: string;
  bounce: boolean;
  stats:boolean;
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
      <Scene stats={stats}>
        <BalloonText
          scale={scale}
          text={text}
          color={color}
          bounce={bounce}
          position={[0, 0, -20]}
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
  stats: false,
  color: "#e12222",
  scale: 1,
  text: "Hello World",
  bounce: false,
};
