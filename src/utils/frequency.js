import {radius, maxRadius} from '../constants'

export const castToFraction = frequency => frequency / 255

export const getWidth = (frequency = [], index) => {
  return 1 + castToFraction(frequency[index])
}

export const getBackground = (frequency = [], index) => {
  return `rgba(${frequency[index]}, ${frequency[index]}, 0, ${castToFraction(frequency[index])})`
}

export default {
  getWidth,
  getBackground,
  castToFraction
}
