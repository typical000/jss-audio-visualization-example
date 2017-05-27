import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'

import theme from '../theme'

const size = 50
const animationSpeed = 300

const styles = {
  container: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    opacity: 0.8,
    transition: `all ${animationSpeed}ms`,
    width: size,
    height: size,
    position: 'relative',
    '&:hover': {
      opacity: 1
    }
  },
  base: {
    filter: `drop-shadow(0 0 10px ${theme.active})`,
    position: 'absolute',
    top: 0,
    left: 0
  },
  play: {
    composes: '$base',
    height: 0,
    width: 0,
    opacity: 0,
    marginLeft: 10,
    transform: 'translate(-100%, 0)',
    borderLeft: [size / 1.4, 'solid', theme.active],
    borderTop: [size / 2, 'solid', 'transparent'],
    borderBottom: [size / 2, 'solid', 'transparent'],
    transition: `all ${animationSpeed}ms cubic-bezier(1,0,0,1) ${animationSpeed}ms`,
  },
  playActive: {
    transition: `all ${animationSpeed}ms cubic-bezier(1,0,0,1)`,
    composes: '$play',
    opacity: 1,
    transform: 'translate(0, 0)'
  },

  pause: {
    transition: `all ${animationSpeed}ms cubic-bezier(1,0,0,1)`,
    opacity: 0,
    transform: 'translate(100%, 0)',
    width: size,
    height: size
  },
  pauseActive: {
    transition: `all ${animationSpeed}ms cubic-bezier(1,0,0,1) ${animationSpeed}ms`,
    composes: '$pause',
    opacity: 1,
    transform: 'translate(0, 0)'
  },
  barFirst: {
    composes: '$base',
    float: 'left',
    height: size,
    width: size * 0.33,
    background: theme.active,
  },
  barSecond: {
    composes: '$barFirst',
    marginLeft: size * 0.66
  }
}

const PlayButton = ({active, classes}) => (
  <div className={classes.container}>
    <div className={active ? classes.pauseActive : classes.pause}>
      <div className={classes.barFirst} />
      <div className={classes.barSecond} />
    </div>
    <div className={active ? classes.play : classes.playActive} />
  </div>
)

PlayButton.propTypes = {
  active: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired
}

export default injectSheet(styles)(PlayButton)
