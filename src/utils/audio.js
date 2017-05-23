export const loadAudio = url => new Promise((resolve) => {
  const audio = new Audio()
  audio.src = url
  audio.preload = 'auto'
  audio.addEventListener('loadeddata', resolve.call(this, audio))
})

export default loadAudio
