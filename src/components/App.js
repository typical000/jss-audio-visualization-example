import React from 'react'

// Get some examples from here:
// https://w-labs.at/experiments/audioviz/

const App = () => (
  <div>
    Application
  </div>
)

export default App

// import jss from 'jss'
// import preset from 'jss-preset-default'

// jss.setup(preset())

// const styles = {
//   container1: {
//     background: '#ccc',
//     padding: ({ padding }) => padding,
//     border: ({ borderColor }) => [2, 'solid', borderColor]
//   },
//   container2: {
//     background: '#0f0',
//     padding: ({ padding }) => padding,
//     border: {
//       width: 2,
//       style: 'solid',
//       color: ({ borderColor }) => borderColor
//     }
//   }
// }

// const sheet = jss.createStyleSheet(styles, {link: true}).attach()
// sheet.update({
//   borderColor: '#f00',
//   padding: 10
// })

// const App = () => (
//   <div>
//     <div className={sheet.classes.container1}>Some container</div>
//     <div className={sheet.classes.container2}>Another container</div>
//   </div>
// )

// render(<App />, document.getElementById('example'))
