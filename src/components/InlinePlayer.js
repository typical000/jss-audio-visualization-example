import React, {Component} from 'react'
import PropTypes from 'prop-types'
import times from 'lodash/times'

import {radius, maxRadius} from '../constants'
import theme from '../theme'

import {
  connectFrequencyToAnalyser,
  getFrequencyData,
  castToFraction
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
      frequency: null
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

    if (!frequency) return <div />

    return times(density, i => (<div
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
        width: radius,
        background: theme.active,
        transform: `rotate(${(360 / density) * i}deg) scale(${1 + castToFraction(frequency[i])}, 1)`,
        opacity: castToFraction(frequency[i])
      }}
    />))
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
      opacity: 0.15,
      willChange: 'transform',
      width: radius,
      height: radius,
      transform: `translate(-50%, -50%) scale(${averageFrequency * 10})`
    }

    const circleStyles = {
      position: 'relative',
      width: '100%',
      height: '100%',
      zIndex: 3,
      willChange: 'transform',
      transform: `scale(${1 + (averageFrequency / 3)})`,
    }

    const outerStyles = {
      position: 'relative',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      zIndex: 4,
      background: `radial-gradient(closest-side, ${theme.background} 95%, ${theme.active} 105%)`
    }

    const innerStyles = {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: '50%',
      zIndex: 2,
      background: `radial-gradient(closest-side, ${theme.active} 80%, rgba(0,0,0,0) 100%)`,
      transform: `scale(${1 + (averageFrequency / 5)})`
    }

    return (
      <div style={playerStyles}>
        <div style={glowStyles} />
        <div style={circleStyles}>
          <div style={outerStyles} />
          <div style={innerStyles} />
        </div>
        <div>
          {this.generateBarMarkup()}
        </div>
      </div>
    )
  }
}
