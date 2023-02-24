import * as React from 'react'
import { ComponentStory } from '@storybook/react'

import { Heart, Scene } from '../components'
import { NODEFAULTCONTROLS, STATSOPTION, statTypes, statValues } from './utils'
import { Stats } from '@react-three/drei'
import { HeartProps } from 'components/Heart/Heart'
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Shapes/Heart',
  component: Heart,

  argTypes: {
    color: {
      control: { type: 'color' },
    },
    scale: {
      control: { type: 'range', min: 0, max: 100, step: 0.1 },
    },
    rotate: {
      control: { type: 'boolean' },
    },
    ...STATSOPTION,
    ...NODEFAULTCONTROLS['MESH'],
  },
}

const DefaultHeart = ({ color, scale, rotate, stats }: HeartProps & { stats: statTypes }) => {
  return (
    <>
      <Scene>
        <Stats showPanel={statValues[stats]} />
        <Heart color={color} scale={scale} rotate={rotate} />
      </Scene>
    </>
  )
}

const Template: ComponentStory<typeof DefaultHeart> = (props) => <DefaultHeart {...props} />

export const Default = Template.bind({})
Default.args = {
  stats: 'NONE',
  scale: 1,
  color: '#e12222',
  rotate: true,
}
