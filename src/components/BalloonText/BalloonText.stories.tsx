import * as React from "react";
import { ComponentStory } from "@storybook/react";

import { BalloonText, Scene } from "..";

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
  },
};

type DefaultBalloonTextProps = {
  color: string;
  scale: number;
  text: string;
  bounce: boolean;
};

const DefaultBalloonText = ({
  color,
  scale,
  text,
  bounce,
}: DefaultBalloonTextProps) => {
  return (
    <>
      <Scene>
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
  color: "#e12222",
  scale: 1,
  text: "Hello World",
  bounce: false,
};
