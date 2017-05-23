import React, {Component} from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'

import {loadAudio} from '../utils/audio'
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
  scene: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
}

class App extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  componentDidMount() {
    loadAudio('media/music.mp3').then(this.onLoad)
  }

  // TODO: Move to utils
  onLoad = (audio) => {
    // Define right audio context (Safari doesn't support without prefix)
    const AudioContext = window.AudioContext || window.webkitAudioContext

    const ctx = new AudioContext()
    const audioSrc = ctx.createMediaElementSource(audio)
    const analyser = ctx.createAnalyser()

    // analyser.fftSize = 1024
    analyser.fftSize = 32

    audioSrc.connect(analyser)
    // Preserva audio output
    // audioSrc.connect(ctx.destination)

    const frequencyData = new Uint8Array(analyser.frequencyBinCount)

    const getFrame = () => {
      requestAnimationFrame(getFrame)
      analyser.getByteFrequencyData(frequencyData)

      // console.log(frequencyData)
    }

    audio.play()
    getFrame()
  }

  render() {
    const {classes} = this.props

    return (
      <GlobalStyles>
        <div className={classes.app}>
          <div className={classes.title}>
            HTML5 Aduio visualization with JSS
          </div>
          <div className={classes.scene}>
            <Player />
          </div>
        </div>
      </GlobalStyles>
    )
  }
}

export default injectSheet(styles)(App)
