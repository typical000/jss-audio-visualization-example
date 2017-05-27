import {radius, maxRadius} from '../constants'

export const castToFraction = frequency => frequency / 255

export const getWidth = (frequency, index) => {
  if (frequency && frequency[index]) {
    return (castToFraction(frequency[index]) * (maxRadius - radius)) + radius
  }
  return 0
}

export const getBackground = (frequency, index) => {
  if (frequency) {
    return `rgba(${frequency[index]}, ${frequency[index]}, 0, ${castToFraction(frequency[index])})`
  }
  return 'transparent'
}

export default {
  getWidth,
  getBackground,
  castToFraction
}
