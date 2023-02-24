import * as React from 'react'
import { ComponentStory } from '@storybook/react'

import { BalloonText, Scene } from '../components'
import { NODEFAULTCONTROLS, STATSOPTION, statTypes, statValues } from './utils'
import { Stats } from '@react-three/drei'
import { BalloonTextProps } from 'components/BalloonText/BalloonText'
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Componets/BalloonText',
  component: BalloonText,

  argTypes: {
    scale: {
      control: { type: 'range', min: 0, max: 100, step: 0.1 },
    },
    text: {
      control: { type: 'text' },
    },
    bounce: {
      control: { type: 'boolean' },
    },
    color: {
      control: { type: 'color' },
    },
    ...STATSOPTION,
    ...NODEFAULTCONTROLS['MESH'],
  },
}

const DefaultBalloonText = ({ color, scale, text, bounce, stats }: BalloonTextProps & { stats: statTypes }) => {
  return (
    <>
      <Scene>
        <Stats showPanel={statValues[stats]} />
        <BalloonText scale={scale} text={text} color={color} bounce={bounce} position={[0, 0, 10]}/>
      </Scene>
    </>
  )
}

const Template: ComponentStory<typeof DefaultBalloonText> = (props) => <DefaultBalloonText {...props} />

export const Default = Template.bind({})
Default.args = {
  stats: 'NONE',
  lookAtCamera : false,
  color: '#f63b3b',
  scale: 1,
  text: 'Hello World',
  bounce: true,
}
