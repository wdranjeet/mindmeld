import { useState, useRef, useEffect } from 'react'
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiX } from 'react-icons/fi'
import type { Song } from '../types'

interface AudioPlayerProps {
  currentSong: Song | null
  playlist: Song[]
  onClose: () => void
  onSongChange: (song: Song) => void
}

export default function AudioPlayer({ currentSong, playlist, onClose, onSongChange }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong?.url) return

    const handleLoadStart = () => {
      setIsLoading(true)
      setHasError(false)
    }
    const handleCanPlay = () => setIsLoading(false)
    const handleError = () => {
      setIsLoading(false)
      setHasError(true)
      console.error('Audio playback error for:', currentSong?.url)
    }
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      // Auto-play next song
      const currentIndex = playlist.findIndex(song => song.id === currentSong.id)
      if (currentIndex < playlist.length - 1) {
        onSongChange(playlist[currentIndex + 1])
      }
    }

    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentSong, playlist, onSongChange])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
  }, [volume])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio || !currentSong?.url) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(console.error)
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value))
  }

  const playPrevious = () => {
    const currentIndex = playlist.findIndex(song => song.id === currentSong?.id)
    if (currentIndex > 0) {
      onSongChange(playlist[currentIndex - 1])
    }
  }

  const playNext = () => {
    const currentIndex = playlist.findIndex(song => song.id === currentSong?.id)
    if (currentIndex < playlist.length - 1) {
      onSongChange(playlist[currentIndex + 1])
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!currentSong) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-white via-orange-50 to-pink-50 shadow-2xl border-t z-50">
      <audio
        ref={audioRef}
        src={currentSong.url}
        preload="metadata"
        crossOrigin="anonymous"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Song Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48?text=♪'
              }}
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-800 truncate">
                {currentSong.title}
              </h4>
              <p className="text-sm text-gray-600 truncate">
                {currentSong.artist || currentSong.subtitle}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4 mx-8">
            <button
              onClick={playPrevious}
              disabled={playlist.findIndex(song => song.id === currentSong.id) === 0}
              className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiSkipBack className="text-xl" />
            </button>
            
            <button
              onClick={togglePlayPause}
              disabled={!currentSong.url || isLoading || hasError}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white p-3 rounded-full transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {hasError ? (
                <span className="text-xs">❌</span>
              ) : isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <FiPause className="text-xl" />
              ) : (
                <FiPlay className="text-xl ml-0.5" />
              )}
            </button>
            
            <button
              onClick={playNext}
              disabled={playlist.findIndex(song => song.id === currentSong.id) === playlist.length - 1}
              className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiSkipForward className="text-xl" />
            </button>
          </div>

          {/* Volume & Close */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FiVolume2 className="text-gray-600" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 accent-orange-500"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 flex items-center space-x-4">
          <span className="text-xs text-gray-500 min-w-[40px]">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-orange-500"
            />
          </div>
          <span className="text-xs text-gray-500 min-w-[40px]">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  )
}