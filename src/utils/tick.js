import Stats from 'stats.js'

const stats = (() => {
  const stats = new Stats()

  stats.showPanel(0) // Show FPS

  stats.dom.style.top = 'auto'
  stats.dom.style.bottom = '20px'
  stats.dom.style.left = '20px'

  document.body.appendChild(stats.dom)

  return stats
})()

export const tick = (() => {
  const delay = 100
  let lastTime = Date.now()

  return function tick(callback) {
    const now = Date.now()
    stats.begin()
    if (now - lastTime > delay) {
      callback()
      lastTime = now
    }
    stats.end()
    requestAnimationFrame(tick.bind(null, callback))
  }
})()