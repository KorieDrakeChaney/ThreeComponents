import * as React from 'react'
import { ComponentStory } from '@storybook/react'

import { BalloonParticles, Scene } from '../components'
import { NODEFAULTCONTROLS, STATSOPTION, statTypes, statValues } from './utils'
import { Stats } from '@react-three/drei'
import { BalloonMode } from 'components/BalloonParticles/utils'
import { BalloonParticlesProps } from 'components/BalloonParticles/BalloonParticles'
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Componets/BalloonParticles',
  component: BalloonParticles,

  argTypes: {
    mode: {
      control: { type: 'select' }, options : ['Regular', 'Circular']
    },
    balloonType: {
      control: { type: 'select' }, options : ['Basic', 'Tube', 'Star', 'Heart', 'Sphere', 'Bulb']
    },
    scale: {
      control: { type: 'range', min: 0, max: 10, step: 0.1 },
    },
    radius: {
      control: { type: 'range', min: 5, max: 50, step: 0.1 },
    },
    color: {
      control: { type: 'color' },
    },
    count: {
      control: { type: 'range', min: 1, max: 10000, step: 1 },
    },
    ...STATSOPTION,
    ...NODEFAULTCONTROLS['MESH'],
  },
}

const DefaultBalloonParticles = ({ scale, stats, color, count, mode, radius, balloonType }: BalloonParticlesProps & {stats : statTypes}) => {
  return (
    <>
      <Scene>
        <Stats showPanel={statValues[stats]} />
        <BalloonParticles scale={scale} color={color} count={count} mode={mode} radius={radius} balloonType={balloonType}/>
      </Scene>
    </>
  )
}

const Template: ComponentStory<typeof DefaultBalloonParticles> = (props) => <DefaultBalloonParticles {...props} />

export const Default = Template.bind({})
Default.args = {
  stats: 'NONE',
  mode : "Circular",
  balloonType : 'Heart',
  scale: 1,
  radius:10,
  color: '#f63b3b',
  count: 100,
}
