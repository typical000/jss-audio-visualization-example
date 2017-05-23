import React from 'react'
import {render} from 'react-dom'
import App from './components/App'

import 'whatwg-fetch'

render(<App />, document.body.appendChild(document.createElement('div')))
