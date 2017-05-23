import React, {Component} from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import times from 'lodash/times'

import theme from '../theme'
import tick from '../utils/tick'

let update

const AudioContext = window.AudioContext || window.webkitAudioContext

const amount = 128
const radius = 100
const maxSoundRadius = 150

const styles = {
  player: {
    width: radius * 2,
    height: radius * 2,
    position: 'relative',
    '&::after': {
      content: '""',
      width: radius * 6,
      height: radius * 6,
      position: 'absolute',
      zIndex: 1,
      background: `radial-gradient(closest-side, ${theme.active}, transparent)`,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      opacity: 0.15
    }
  },
  circle: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    position: 'relative',
    zIndex: 3,
    background: theme.background,
    boxShadow: [{
      blur: 50,
      spread: 2,
      color: theme.active
    }, {
      inset: 'inset',
      blur: 10,
      color: theme.active
    }]
  },
  bar: {
    transformOrigin: [0, '50%'],
    maxWidth: maxSoundRadius,
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: 3,
    background: `linear-gradient(to right, ${theme.background} 50%, ${theme.active})`,
    borderRadius: 10,
    zIndex: 2,
    transition: ['linear', 'all', '100ms'],
    boxShadow: [{
      blur: 10,
      spread: 1,
      color: theme.active
    }, {
      inset: 'inset',
      blur: 2,
      color: theme.active
    }]
  }
}

times(amount, (i) => {
  styles[`bar${i}`] = {
    composes: '$bar',
    transform: `rotate(${(360 / amount) * i}deg)`,
    // TODO: Don't set width
    width: (Math.random() * (maxSoundRadius - radius)) + radius
  }
})

// Get some examples from here:
// https://w-labs.at/experiments/audioviz/

tick(() => {
  if (update) update()
})

class Player extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  shouldComponentUpdate = () => false

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
