import React, {Component} from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'

import GlobalStyles from './GlobalStyles'
import Player from './Player'
import theme from '../theme'

import {loadAudio} from '../utils/audio'
import tick from '../utils/tick'

let update

tick(() => {
  if (update) update()
})

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

  constructor(props) {
    super(props)

    this.state = {
      audio: false
    }
  }

  componentDidMount() {
    if (!this.state.audio) {
      loadAudio('media/music.mp3').then((audio) => {
        this.setState({audio})
      })
    }
  }

  renderPlayer() {
    const {classes} = this.props
    if (this.state.audio) {
      return <Player audio={this.state.audio} />
    }

    return <div className={classes.loading}>Loading...</div>
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
            {this.renderPlayer()}
          </div>
        </div>
      </GlobalStyles>
    )
  }
}

export default injectSheet(styles)(App)
