import React, {Component} from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'

import GlobalStyles from './GlobalStyles'
import Player from './Player'
import InlinePlayer from './InlinePlayer'
import Controls from './Controls'
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
  inner: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  header: {
    top: 20,
    left: 20,
    position: 'absolute',
    zIndex: 10
  },
  title: {
    marginBottom: 10,
    fontWeight: 'bold'
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
      audio: false,
      density: 256,
      engine: 'jss'
    }
  }

  componentDidMount() {
    if (!this.state.audio) {
      loadAudio('media/music.mp3').then((audio) => {
        this.setState({audio})
      })
    }
  }

  setDensity = (e) => {
    this.setState({density: +e.target.textContent})
  }

  setEngine = (e) => {
    this.setState({engine: e.target.dataset.key})
  }

  renderPlayer() {
    const {classes} = this.props
    const {audio, density, engine} = this.state

    if (!audio) {
      return <div className={classes.loading}>Loading...</div>
    }

    if (engine === 'jss') {
      return <Player audio={audio} density={density} />
    }

    return <InlinePlayer audio={audio} density={density} />
  }

  render() {
    const {classes} = this.props
    const {density, engine} = this.state

    return (
      <GlobalStyles>
        <div className={classes.app}>
          <div className={classes.inner}>
            <div className={classes.header}>
              <div className={classes.title}>
                HTML5 Aduio visualization with JSS
              </div>
              <Controls
                density={density}
                engine={engine}
                onEngineClick={this.setEngine}
                onDistanceClick={this.setDensity}
              />
            </div>
            <div className={classes.scene}>
              {this.renderPlayer()}
            </div>
          </div>
        </div>
      </GlobalStyles>
    )
  }
}

export default injectSheet(styles)(App)
