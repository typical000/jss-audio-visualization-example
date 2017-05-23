import Stats from 'stats.js'

const stats = (() => {
  const fpsStats = new Stats()

  fpsStats.showPanel(0) // Show FPS

  fpsStats.dom.style.top = 'auto'
  fpsStats.dom.style.bottom = '20px'
  fpsStats.dom.style.left = '20px'

  document.body.appendChild(fpsStats.dom)

  return fpsStats
})()

const tick = (() => {
  const delay = 100
  let lastTime = Date.now()

  return function ticker(callback) {
    const now = Date.now()
    stats.begin()
    if (now - lastTime > delay) {
      callback()
      lastTime = now
    }
    stats.end()
    requestAnimationFrame(ticker.bind(null, callback))
  }
})()

export default tick
