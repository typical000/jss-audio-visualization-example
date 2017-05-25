import React, {Component} from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import times from 'lodash/times'

import theme from '../theme'

import {
  connectFrequencyToAnalyser,
  getFrequencyData,
  castToFraction
} from '../utils/audio'

// TODO: Make changable via controls
const amount = 256

const radius = 100
const maxSoundRadius = 200

const styles = {
  player: {
    width: radius * 2,
    height: radius * 2,
    position: 'relative',
    transform: ({rotation}) => `rotate(${rotation}deg)`,
    '&::after': {
      content: '""',
      position: 'absolute',
      zIndex: 1,
      background: `radial-gradient(closest-side, ${theme.active}, transparent)`,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      opacity: 0.15,
      width: ({averageFrequency}) => `${averageFrequency * 10 * radius}px`,
      height: ({averageFrequency}) => `${averageFrequency * 10 * radius}px`
    }
  },
  circle: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    position: 'relative',
    zIndex: 3,
    background: theme.background,
    transform: ({averageFrequency}) => `scale(${1 + (averageFrequency / 3)})`,
    boxShadow: ({averageFrequency}) => {
      if (averageFrequency <= 0.5) return `0 0 5px 1px ${theme.active}, inset 0 0 5px 1px ${theme.active}`
      return `0 0 ${averageFrequency * 30}px 2px ${theme.active}, inset 0 0 ${averageFrequency * 20}px 1px ${theme.active}`
    }
  },
  bar: {
    transformOrigin: [0, '50%'],
    maxWidth: maxSoundRadius,
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: 2,
    borderRadius: 10,
    zIndex: 2
  }
}

times(amount, (i) => {
  styles[`bar${i}`] = {
    composes: '$bar',
    transform: `rotate(${(360 / amount) * i}deg)`,
    background: ({frequency}) => frequency && `rgba(${frequency[i]}, ${frequency[i]}, 0, ${castToFraction(frequency[i])})`,
    width: ({frequency}) => frequency && castToFraction(frequency[i]) * (maxSoundRadius - radius) + radius
  }
})

class Player extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    audio: PropTypes.object.isRequired
  }

  componentDidMount() {
    const {audio} = this.props

    let frequency = connectFrequencyToAnalyser(audio, {
      fftSize: amount
    })
    let rotation = 0

    const resultFrequency = new Uint8Array(frequency.length * 2)

    const getFrame = () => {
      frequency = getFrequencyData(frequency)

      // Make mirrored frequency for better visualization
      resultFrequency.set(frequency)
      resultFrequency.set(frequency, frequency.length)

      this.props.sheet.update({
        frequency: resultFrequency,
        averageFrequency: castToFraction(frequency[frequency.length / 2]),
        rotation: ++rotation * 0.1
      })

      requestAnimationFrame(getFrame)
    }

    // TODO: Remove after debugging
    audio.currentTime = 90

    audio.play()
    getFrame()
  }

  shouldComponentUpdate = () => false

  componentWillUnmount() {
    this.props.audio.pause()
  }

  render() {
    const {classes} = this.props

    return (
      <div className={classes.player}>
        <div className={classes.circle} />
        <div className={classes.bars}>
          {times(amount, i => <div key={i} className={classes[`bar${i}`]} />)}
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(Player)
