export const castToFraction = frequency => frequency / 255

export const getWidth = (frequency = [], index) => 1 + castToFraction(frequency[index])

export const getBackground = (frequency = [], index) => `rgba(${frequency[index]}, ${frequency[index]}, 0, ${castToFraction(frequency[index])})`

export default {
  getWidth,
  getBackground,
  castToFraction
}
