import React, {Component} from 'react'
import PropTypes from 'prop-types'
import times from 'lodash/times'

import {radius, maxRadius} from '../constants'
import theme from '../theme'

import {
  getWidth,
  getBackground,
  castToFraction
} from '../utils/frequency'
import {
  connectFrequencyToAnalyser,
  getFrequencyData
} from '../utils/audio'


// Just want to say - sorry for big performance impact :)
export default class InlinePlayer extends Component {
  static propTypes = {
    audio: PropTypes.object.isRequired,
    playing: PropTypes.bool.isRequired,
    density: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      rotation: 0,
      averageFrequency: 0,
      frequency: []
    }

    // Just set starting point from good position :)
    if (props.playing) {
      props.audio.currentTime = 90
      props.audio.play()
    }
  }

  componentDidMount() {
    this.updateScene(this.props.audio, this.props.density)
  }

  componentWillReceiveProps(nextProps) {
    const {audio} = this.props
    if (nextProps.playing) audio.play()
    else audio.pause()

    this.updateScene(audio, nextProps.density)
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frame)
    this.props.audio.pause()
  }

  updateScene(audio, density) {
    this.frequency = connectFrequencyToAnalyser(audio, {
      fftSize: density
    })

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

    this.setState({
      rotation,
      frequency: resultFrequency,
      averageFrequency: castToFraction(frequency[frequency.length / 2])
    })

    this.frame = requestAnimationFrame(this.updateFrame.bind(this, frequency, rotation))
  }

  generateBarMarkup() {
    const {density} = this.props
    const {frequency} = this.state
    const barWeight = Math.ceil(360 / density)

    return times(density, i => (
      <div
        key={i}
        style={{
          transformOrigin: '0 50%',
          maxWidth: maxRadius,
          position: 'absolute',
          top: '50%',
          left: '50%',
          height: barWeight,
          borderRadius: '10px',
          zIndex: 2,
          transform: `rotate(${(360 / density) * i}deg)`,
          background: getBackground(frequency, i),
          width: getWidth(frequency, i),
          willChange: 'auto'
        }}
      />
    ))
  }

  render() {
    const {rotation, averageFrequency} = this.state

    const playerStyles = {
      width: radius * 2,
      height: radius * 2,
      position: 'relative',
      willChange: 'transform',
      transform: `rotate(${rotation}deg)`
    }

    const glowStyles = {
      position: 'absolute',
      zIndex: 1,
      background: `radial-gradient(closest-side, ${theme.active}, transparent)`,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      opacity: 0.15,
      willChange: 'width, height',
      width: `${averageFrequency * 10 * radius}px`,
      height: `${averageFrequency * 10 * radius}px`
    }

    const circleStyles = {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      position: 'relative',
      zIndex: 3,
      background: theme.background,
      willChange: 'transform',
      transform: `scale(${1 + (averageFrequency / 3)})`,
      boxShadow: (() => {
        if (averageFrequency <= 0.5) return `0 0 5px 1px ${theme.active}, inset 0 0 5px 1px ${theme.active}`
        return `0 0 ${averageFrequency * 30}px 2px ${theme.active}, inset 0 0 ${averageFrequency * 20}px 1px ${theme.active}`
      })()
    }

    return (
      <div style={playerStyles}>
        <div style={glowStyles} />
        <div style={circleStyles} />
        <div>
          {this.generateBarMarkup()}
        </div>
      </div>
    )
  }
}
