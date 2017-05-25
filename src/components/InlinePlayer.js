import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {
  connectFrequencyToAnalyser,
  getFrequencyData,
  castToFraction
} from '../utils/audio'

// Just want to say - sorry for big performance impact :)
export default class InlinePlayer extends Component {
  static propTypes = {
    audio: PropTypes.object.isRequired,
    density: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        Inline React Styles
      </div>
    )
  }
}
