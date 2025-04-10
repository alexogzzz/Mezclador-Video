"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Square, Volume2, Volume1, VolumeX } from "lucide-react"

interface MediaPlayerProps {
  type: "audio" | "video"
  src: string
  title?: string
  muted?: boolean; // Optional muted property
  
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ type, src, title = "Media File" }) => {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  // Función para reproducir el medio
  const play = () => {
    if (mediaRef.current) {
      mediaRef.current.play()
      setIsPlaying(true)
    }
  }

  // Función para pausar el medio
  const pause = () => {
    if (mediaRef.current) {
      mediaRef.current.pause()
      setIsPlaying(false)
    }
  }

  // Función para detener el medio (pausar y reiniciar tiempo)
  const stop = () => {
    if (mediaRef.current) {
      mediaRef.current.pause()
      mediaRef.current.currentTime = 0
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }

  // Función para cambiar el volumen
  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (mediaRef.current) {
      mediaRef.current.volume = newVolume
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  // Función para silenciar/activar el sonido
  const toggleMute = () => {
    if (!mediaRef.current) return

    if (isMuted) {
      mediaRef.current.volume = volume
      setIsMuted(false)
    } else {
      mediaRef.current.volume = 0
      setIsMuted(true)
    }
  }

  // Función para actualizar la barra de progreso
  const updateProgress = () => {
    if (!mediaRef.current) return

    const currentTime = mediaRef.current.currentTime
    const duration = mediaRef.current.duration
    setCurrentTime(currentTime)

    if (progressRef.current) {
      const progressPercent = (currentTime / duration) * 100
      progressRef.current.style.width = `${progressPercent}%`
    }
  }

  // Función para cambiar la posición de reproducción
  const setProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mediaRef.current) return

    const progressBar = e.currentTarget
    const clickPosition = e.nativeEvent.offsetX
    const width = progressBar.clientWidth
    const percent = clickPosition / width
    const newTime = percent * duration

    mediaRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Formatear tiempo en formato mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Manejar eventos del medio
  useEffect(() => {
    const media = mediaRef.current
    if (!media) return

    const handleLoadedMetadata = () => {
      setDuration(media.duration)
      setIsLoaded(true)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      if (progressRef.current) {
        progressRef.current.style.width = "0%"
      }
    }

    media.addEventListener("loadedmetadata", handleLoadedMetadata)
    media.addEventListener("timeupdate", updateProgress)
    media.addEventListener("ended", handleEnded)

    return () => {
      media.removeEventListener("loadedmetadata", handleLoadedMetadata)
      media.removeEventListener("timeupdate", updateProgress)
      media.removeEventListener("ended", handleEnded)
    }
  }, [])

  // Renderizado condicional basado en el tipo de medio
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto my-6">
      <div className="p-4 bg-gray-700">
        <h3 className="text-lg font-semibold truncate">{title}</h3>
      </div>

      <div className="relative">
        {type === "video" ? (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            className="w-full aspect-video bg-black"
            controls={false}
            preload="metadata"
          >
            <source src={src} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
        ) : (
          <div className="bg-gradient-to-r from-primary-700 to-primary-900 aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                <Volume2 className="w-12 h-12" />
              </div>
              <audio ref={mediaRef as React.RefObject<HTMLAudioElement>} controls={false} preload="metadata">
                <source src={src} type="audio/mp3" />
                Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
          </div>
        )}
      </div>

      {/* Barra de progreso */}
      <div className="h-2 bg-gray-600 cursor-pointer relative" onClick={setProgress}>
        <div ref={progressRef} className="h-full bg-primary-500 transition-all duration-100"></div>
      </div>

      <div className="p-4">
        {/* Tiempo actual y duración */}
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{isLoaded ? formatTime(duration) : "--:--"}</span>
        </div>

        {/* Controles principales */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {isPlaying ? (
              <button
                onClick={pause}
                className="p-2 rounded-full bg-primary-600 hover:bg-primary-700 transition-colors"
                aria-label="Pausar"
              >
                <Pause className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={play}
                className="p-2 rounded-full bg-primary-600 hover:bg-primary-700 transition-colors"
                aria-label="Reproducir"
              >
                <Play className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={stop}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              aria-label="Detener"
            >
              <Square className="w-5 h-5" />
            </button>
          </div>

          {/* Control de volumen */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="p-1 rounded-full hover:bg-gray-700 transition-colors"
              aria-label={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={changeVolume}
              className="w-20 md:w-32 accent-primary-500"
              aria-label="Control de volumen"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MediaPlayer
