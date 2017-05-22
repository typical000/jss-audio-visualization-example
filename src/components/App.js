import React, {Component} from 'react'
import injectSheet from 'react-jss'

import GlobalStyles from './GlobalStyles'
import Player from './Player'
import theme from '../theme'

const styles = {
  app: {
    overflow: 'hidden',
    width: '100vw',
    height: '100vh',
    background: theme.background,
    color: theme.color,
    font: {
      family: theme.fontFamily,
      size: theme.fontSize,
      lineHeight: 1.5
    }
  },
  title: {
    top: 20,
    left: 20,
    position: 'absolute',
    zIndex: 10
  },
  audio: {
    top: 20,
    right: 20,
    position: 'absolute',
    zIndex: 10
  },
  scene: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
}

class App extends Component {
  render() {
    const {classes} = this.props

    return (
      <GlobalStyles>
        <div className={classes.app}>
          <div className={classes.title}>
            HTML5 Aduio visualization with JSS
          </div>
          <audio
            className={classes.audio}
            src={"media/music.mp3"}
            ref={(audio) => {this.audio = audio}}
            controls
            loop
          />
          <div className={classes.scene}>
            <Player />
          </div>
        </div>
      </GlobalStyles>
    )
  }
}

export default injectSheet(styles)(App)
