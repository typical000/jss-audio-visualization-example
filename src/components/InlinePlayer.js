import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {
  connectFrequencyToAnalyser,
  getFrequencyData
} from '../utils/audio'

// Just want to say - sorry for big performance impact :)
export default class InlinePlayer extends Component {
  static propTypes = {
    audio: PropTypes.object.isRequired,
    density: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props)

    const {audio, density} = props

    // Just set starting point from good position :)
    audio.currentTime = 90
    audio.play()

    this.updateScene(audio, density)
  }

  updateScene(audio, density) {
    this.frequency = connectFrequencyToAnalyser(audio, {
      fftSize: density
    })

    this.generateBarStyles(density)
    // Cancel previous frame loop to avoid data accumulation
    cancelAnimationFrame(this.frame)
    this.updateFrame(this.frequency)
  }

  updateFrame(frequency, rotation = 0) {
    const resultFrequency = new Uint8Array(frequency.length * 2)

    frequency = getFrequencyData(frequency)
    rotation += 0.1

    // Make mirrored frequency for better visualization
    resultFrequency.set(frequency)
    resultFrequency.set(frequency, frequency.length)

    // TODO: Replace with inline one
    // this.props.sheet.update({
    //   frequency: resultFrequency,
    //   averageFrequency: castToFraction(frequency[frequency.length / 2]),
    //   rotation
    // })

    this.frame = requestAnimationFrame(this.updateFrame.bind(this, frequency, rotation))
  }

  generateBarStyles(density) {
    console.log(this, density)
  }

  generateBarMarkup() {
    console.log(this)
  }

  render() {
    return (
      <div>
        Inline React Styles
      </div>
    )
  }
}
