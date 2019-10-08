import React from 'react'
import { Dimensions } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import Animated from 'react-native-reanimated'
import { initialSideWidth } from './WeaveHelpers'

const { width } = Dimensions.get('window')
const { sub, interpolate } = Animated

const size = 50
interface ButtonProps {
  progress: Animated.Node<number>
  y: Animated.Node<number>
}

export default ({ progress, y }: ButtonProps) => {
  const translateY = sub(y, size / 2)
  const translateX = interpolate(progress, {
    inputRange: [0, 0.4],
    outputRange: [width - initialSideWidth - size + 8, 0]
  })
  const opacity = interpolate(progress, {
    inputRange: [0, 0.2],
    outputRange: [1, 0]
  })
  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: size,
        height: size,
        borderRadius: size / 2,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateY }, { translateX }],
        opacity
      }}
    >
      <Icon name="chevron-left" color="black" size={40} />
    </Animated.View>
  )
}
