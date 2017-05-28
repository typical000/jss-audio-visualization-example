import React, {Component} from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import times from 'lodash/times'

import {radius, maxRadius} from '../constants'
import theme from '../theme'

import {
  connectFrequencyToAnalyser,
  getFrequencyData,
  castToFraction
} from '../utils/audio'

const styles = {
  player: {
    width: radius * 2,
    height: radius * 2,
    position: 'relative',
    willChange: 'transform',
    transform: ({rotation}) => `rotate(${rotation}deg)`,
  },
  glow: {
    position: 'absolute',
    zIndex: 1,
    background: `radial-gradient(closest-side, ${theme.active}, transparent)`,
    top: '50%',
    left: '50%',
    opacity: 0.15,
    width: radius,
    height: radius,
    transform: ({averageFrequency}) => `translate(-50%, -50%) scale(${averageFrequency * 10})`
  },
  circle: {
    position: 'relative',
    width: '100%',
    height: '100%',
    zIndex: 3,
    willChange: 'transform',
    transform: ({averageFrequency}) => `scale(${1 + (averageFrequency / 3)})`
  },
  inner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    zIndex: 4,
    background: `radial-gradient(
      closest-side,
      ${theme.background} 95%,
      ${theme.active} 105%
    )`
  },
  outer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: '50%',
    zIndex: 2,
    background: `radial-gradient(closest-side, ${theme.active} 80%, rgba(0,0,0,0) 100%)`,
    transform: ({averageFrequency}) => `scale(${1 + (averageFrequency / 5)})`
  }
}

class Player extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    audio: PropTypes.object.isRequired,
    playing: PropTypes.bool.isRequired,
    density: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props)

    // Just set starting point from good position :)
    if (props.playing) {
      props.audio.currentTime = 90
      props.audio.play()
    }

    this.updateScene(props.audio, props.density)
  }

  componentWillReceiveProps(nextProps) {
    const {audio} = this.props
    if (nextProps.playing) audio.play()
    else audio.pause()
  }

  shouldComponentUpdate(nextProps) {
    // Avoid updating when user just changes play or pause
    if (this.props.playing !== nextProps.playing) return false
    return true
  }

  componentWillUpdate(nextProps) {
    this.updateScene(this.props.audio, nextProps.density)
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frame)
    this.props.audio.pause()
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

    this.props.sheet.update({
      frequency: resultFrequency,
      averageFrequency: castToFraction(frequency[frequency.length / 2]),
      rotation
    })

    this.frame = requestAnimationFrame(this.updateFrame.bind(this, frequency, rotation))
  }

  generateBarStyles(density) {
    const {sheet} = this.props
    const barWeight = Math.ceil(360 / density)

    // Remove previously added style and add new one
    times(density, (i) => {
      sheet.deleteRule(`bar${i}`)
      sheet.addRule(`bar${i}`, {
        transformOrigin: [0, '50%'],
        maxWidth: maxRadius,
        position: 'absolute',
        top: '50%',
        left: '50%',
        height: barWeight,
        borderRadius: 10,
        zIndex: 2,
        width: radius,
        background: theme.active,
        transform: ({frequency}) => frequency && `rotate(${(360 / density) * i}deg) scale(${1 + castToFraction(frequency[i])}, 1)`,
        opacity: ({frequency}) => frequency && castToFraction(frequency[i])
      })
    })
  }

  generateBarMarkup() {
    const {classes, density} = this.props
    return times(density, i => <div key={i} className={classes[`bar${i}`]} />)
  }

  render() {
    const {classes} = this.props

    return (
      <div className={classes.player}>
        <div className={classes.glow} />
        <div className={classes.circle}>
          <div className={classes.outer} />
          <div className={classes.inner} />
        </div>
        <div className={classes.bars}>
          {this.generateBarMarkup()}
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(Player)
