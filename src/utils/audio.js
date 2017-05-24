// Define right audio context (Safari doesn't support without prefix)
const AudioContext = window.AudioContext || window.webkitAudioContext

const ctx = new AudioContext()
const analyser = ctx.createAnalyser()

// TODO: Make changable via controls
analyser.fftSize = 256
analyser.minDecibels = -120 // -100
analyser.maxDecibels = -30 // -30
analyser.smoothingTimeConstant = 0.85 // 0.8

export const loadAudio = url => new Promise((resolve) => {
  const audio = new Audio()
  audio.src = url
  audio.preload = 'auto'
  audio.addEventListener('loadeddata', resolve.call(this, audio))
})

export const connectFrequencyToAnalyser = (audio) => {
  const audioSrc = ctx.createMediaElementSource(audio)

  audioSrc.connect(analyser)
  audioSrc.connect(ctx.destination)

  const frequencyData = new Uint8Array(analyser.frequencyBinCount)

  return frequencyData
}

export const getFrequencyData = (frequencyData) => {
  analyser.getByteFrequencyData(frequencyData)

  return frequencyData
}

export const castFrequencyToFractional = frequency => frequency / 255

export default loadAudio
