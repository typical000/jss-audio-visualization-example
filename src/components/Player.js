import React from 'react'
import injectSheet from 'react-jss'

import GlobalStyles from './GlobalStyles'
import theme from '../theme'

const styles = {
  player: {
    width: 200,
    height: 200,
    position: 'relative'
  },
  circle: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    boxShadow: [{
      blur: 50,
      color: theme.active
    }, {
      inset: 'inset',
      blur: 10,
      color: theme.active
    }]
  }
}

// Get some examples from here:
// https://w-labs.at/experiments/audioviz/

const amount = 1000

const Player = ({classes}) => (
  <div className={classes.player}>
    <div className={classes.circle} />
  </div>
)

export default injectSheet(styles)(Player)
