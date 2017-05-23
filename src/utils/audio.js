export const loadAudio = (url) => new Promise((resolve, reject) => {
  const audio = new Audio()
  audio.src = url
  audio.preload = 'auto'
  audio.autoplay = true
  audio.addEventListener('loadeddata', resolve.call(this, audio))
})
