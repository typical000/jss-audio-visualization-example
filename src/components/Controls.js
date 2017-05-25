import React, {Component} from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import forOwn from 'lodash/forOwn'

import theme from '../theme'

const densities = [128, 256, 512, 1024, 2048]
const engines = {
  jss: 'JSS',
  inline: 'React inline styles'
}

const styles = {
  row: {
    fontSize: 12,
    marginBottom: 15
  },
  title: {
    marginBottom: 5
  },
  option: {
    display: 'inline-block',
    cursor: 'pointer',
    border: 0,
    borderBottom: [2, 'solid', 'transparent'],
    outline: 0,
    padding: [5, 0],
    margin: [0, 0, 0, 20],
    boxShadow: 'none',
    background: 'none',
    color: theme.color,
    transitionDuration: 200,
    font: {
      family: theme.fontFamily,
      size: 12,
      weight: 'bold'
    },
    '&:first-of-type': {
      marginLeft: 0
    },
    '&:hover': {
      color: theme.avtive
    }
  },
  selected: {
    composes: '$option',
    color: theme.active,
    borderBottomColor: theme.active,
    pointerEvents: 'none'
  }
}

class Controls extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    density: PropTypes.number.isRequired,
    engine: PropTypes.string.isRequired,
    onDistanceClick: PropTypes.func.isRequired,
    onEngineClick: PropTypes.func.isRequired
  }

  renderEngines() {
    const {classes, engine, onEngineClick} = this.props
    const markup = []

    forOwn(engines, (value, key) => {
      const className = key === engine ? classes.selected : classes.option
      markup.push((
        <button
          className={className}
          key={key}
          data-key={key}
          onClick={onEngineClick}
        >
          {value}
        </button>
      ))
    })

    return markup
  }

  renderDensities() {
    const {classes, density, onDistanceClick} = this.props

    return densities.map((entry) => {
      const className = entry === density ? classes.selected : classes.option
      return (
        <button
          className={className}
          key={entry}
          onClick={onDistanceClick}
        >
          {entry}
        </button>
      )
    })
  }

  render() {
    const {classes} = this.props

    return (
      <div className={classes.controls}>
        <div className={classes.row}>
          <div className={classes.title}>Engine:</div>
          {this.renderEngines()}
        </div>
        <div className={classes.row}>
          <div className={classes.title}>Density:</div>
          {this.renderDensities()}
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(Controls)
