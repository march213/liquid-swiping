import Animated from 'react-native-reanimated'
import { State } from 'react-native-gesture-handler'
import { onGestureEvent } from 'react-native-redash'

const {
  Value,
  multiply,
  pow,
  sub,
  Clock,
  SpringUtils,
  block,
  startClock,
  clockRunning,
  stopClock,
  and,
  set,
  spring,
  cond,
  eq,
  not,
  add,
  diffClamp
} = Animated

// Thanks Flutter 🙋🏼‍♂️
// https://bit.ly/2mgDDLF
export const frictionFactor = (ratio: Animated.Node<number>) =>
  multiply(0.52, pow(sub(1, ratio), 2))

export const verticalPanGestureHandler = () => {
  const translationY = new Value(0)
  const velocityY = new Value(0)
  const state = new Value(State.UNDETERMINED)
  const gestureHandler = onGestureEvent({
    translationY,
    velocityY,
    state
  })
  return {
    translationY,
    state,
    velocityY,
    gestureHandler
  }
}

export const followPointer = (value: Animated.Node<number>) => {
  const clock = new Clock()
  const config = SpringUtils.makeDefaultConfig()
  const state = {
    position: new Value(),
    velocity: new Value(),
    finished: new Value(0),
    time: new Value(0)
  }

  return block([
    startClock(clock),
    set(config.toValue, value),
    spring(clock, state, config),
    state.position
  ])
}

export const snapProgress = (
  value: Animated.Node<number>,
  gesture: Animated.Value<State>,
  isBack: Animated.Value<0 | 1>,
  point: Animated.Adaptable<number>
) => {
  // (gestureProgress, divide(velocityX, multiply(maxWidth, 0.4)), [
  //   0,
  //   1
  // ])
  const offset = new Value(0)
  const clock = new Clock()
  const config = SpringUtils.makeDefaultConfig()
  const state = {
    position: new Value(0),
    velocity: new Value(0),
    finished: new Value(0),
    time: new Value(0)
  }

  return block([
    cond(
      eq(gesture, State.ACTIVE),
      [
        cond(
          clockRunning(clock),
          [stopClock(clock), set(offset, state.position)],
          set(state.position, diffClamp(add(offset, value), 0, 1))
        )
      ],
      [
        cond(not(clockRunning(clock)), [
          set(state.time, 0),
          set(state.finished, 0),
          set(config.toValue, point),
          startClock(clock)
        ]),
        spring(clock, state, config),
        cond(and(eq(state.finished, 1), clockRunning(clock)), [
          set(isBack, point),
          stopClock(clock),
          set(offset, 0)
        ])
      ]
    ),
    state.position
  ])
}
