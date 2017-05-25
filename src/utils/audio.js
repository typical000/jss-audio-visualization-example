const ctx = new (window.AudioContext || window.webkitAudioContext)()
const analyser = ctx.createAnalyser()
let audioSrc

export const loadAudio = url => new Promise((resolve) => {
  const audio = new Audio()
  audio.src = url
  audio.preload = 'auto'
  audio.loop = true
  audio.addEventListener('loadeddata', resolve.call(this, audio))
})

export const connectFrequencyToAnalyser = (audio, config) => {
  if (typeof audioSrc === 'object') {
    audioSrc.disconnect(analyser)
    audioSrc.disconnect(ctx.destination)
  }
  else {
    audioSrc = ctx.createMediaElementSource(audio)
  }

  if (config) {
    analyser.fftSize = config.fftSize || 256
    analyser.minDecibels = config.minDecibels || -100
    analyser.maxDecibels = config.maxDecibels || -30
    analyser.smoothingTimeConstant = config.smoothingTimeConstant || 0.8
  }

  audioSrc.connect(analyser)
  audioSrc.connect(ctx.destination)

  const frequencyData = new Uint8Array(analyser.frequencyBinCount)

  return frequencyData
}

export const getFrequencyData = (frequencyData) => {
  analyser.getByteFrequencyData(frequencyData)

  return frequencyData
}

export const castToFraction = frequency => frequency / 255

export default loadAudio
