import { useState, useEffect, useCallback } from 'react'
import { FiSearch, FiPlay, FiHeart, FiMusic, FiWifi } from 'react-icons/fi'
import { searchSongs, getTrendingSongs } from './api'
import type { Song } from './types'
import AudioPlayer from './components/AudioPlayer'
import './App.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [currentPlayingSong, setCurrentPlayingSong] = useState<Song | null>(null)
  const [showAudioPlayer, setShowAudioPlayer] = useState(false)

  useEffect(() => {
    // Load trending songs on mount
    const loadInitialSongs = async () => {
      try {
        const trendingSongs = await getTrendingSongs()
        setSongs(trendingSongs)
      } catch (error) {
        console.error('Error loading trending songs:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialSongs()

    // Online/offline listeners
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadTrendingSongs = useCallback(async () => {
    setLoading(true)
    try {
      const trendingSongs = await getTrendingSongs()
      setSongs(trendingSongs)
    } catch (error) {
      console.error('Error loading trending songs:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      loadTrendingSongs()
      return
    }

    setLoading(true)
    try {
      const result = await searchSongs(searchQuery)
      setSongs(result.songs)
    } catch (error) {
      console.error('Error searching songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlaySong = (song: Song) => {
    setCurrentPlayingSong(song)
    setShowAudioPlayer(true)
    setSelectedSong(null) // Close modal if open
  }

  const handleCloseAudioPlayer = () => {
    setShowAudioPlayer(false)
    setCurrentPlayingSong(null)
  }

  const handleSongChange = (song: Song) => {
    setCurrentPlayingSong(song)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-2 rounded-lg">
                <FiMusic className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Bhakti Songs
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <FiWifi className={`text-lg ${isOnline ? 'text-green-500' : 'text-gray-400'}`} />
              <span className="text-sm text-gray-600">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for bhakti songs, artists..."
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-transparent focus:border-orange-400 focus:outline-none bg-gray-100 text-gray-800 placeholder-gray-500 transition-all"
              />
            </div>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-16 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-200/30 via-pink-200/30 to-purple-200/30 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-4 rounded-full shadow-2xl animate-pulse">
                <FiMusic className="text-white text-6xl" />
              </div>
            </div>
            <h2 className="text-6xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-fade-in">
              Divine Melodies 🙏
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Immerse yourself in the spiritual world of <span className="font-semibold text-orange-600">Hindi Bhakti Songs</span>. 
              Experience devotional music that touches the soul - available anytime, anywhere, even offline!
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <span className="text-sm font-semibold text-gray-700">🎵 Devotional Classics</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <span className="text-sm font-semibold text-gray-700">📱 Offline Ready</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <span className="text-sm font-semibold text-gray-700">🎧 High Quality</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Explore by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-xl text-center hover:scale-105 transition-transform cursor-pointer">
              <div className="text-3xl mb-2">🙏</div>
              <p className="font-semibold text-orange-800">Aarti</p>
            </div>
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-6 rounded-xl text-center hover:scale-105 transition-transform cursor-pointer">
              <div className="text-3xl mb-2">🕉️</div>
              <p className="font-semibold text-pink-800">Mantras</p>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-xl text-center hover:scale-105 transition-transform cursor-pointer">
              <div className="text-3xl mb-2">🎶</div>
              <p className="font-semibold text-purple-800">Bhajans</p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl text-center hover:scale-105 transition-transform cursor-pointer">
              <div className="text-3xl mb-2">🎵</div>
              <p className="font-semibold text-blue-800">Chalisa</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-orange-500"></div>
              <div className="absolute inset-0 rounded-full border-4 border-orange-200"></div>
              <div className="absolute inset-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                <FiMusic className="text-white text-2xl animate-pulse" />
              </div>
            </div>
            <p className="text-gray-600 mt-6 text-lg font-medium animate-pulse">
              Loading divine melodies... 🎵
            </p>
          </div>
        )}

        {/* Songs Grid */}
        {!loading && (
          <>
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">🎵 Trending Devotional Songs</h3>
              <p className="text-gray-600">Click on any song to start your spiritual journey</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl card-hover overflow-hidden cursor-pointer group border border-white/20"
                  onClick={() => setSelectedSong(song)}
                >
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=🎵'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button 
                      className="bg-white/95 backdrop-blur-sm rounded-full p-4 transform scale-0 group-hover:scale-100 transition-all duration-300 hover:bg-white animate-glow"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlaySong(song)
                      }}
                    >
                      <FiPlay className="text-orange-500 text-3xl ml-1" />
                    </button>
                  </div>
                  <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all duration-300 hover:scale-110">
                    <FiHeart className="text-pink-500 text-lg" />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-xs font-medium">{song.duration}</span>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                  <h3 className="font-bold text-gray-800 truncate mb-2 text-lg">
                    {song.title}
                  </h3>
                  <p className="text-sm text-gray-600 truncate mb-3">
                    <span className="font-medium">by</span> {song.subtitle || song.artist}
                  </p>
                  {song.album && (
                    <p className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 inline-block">
                      {song.album}
                    </p>
                  )}
                </div>
              </div>
            ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && songs.length === 0 && (
          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto animate-float shadow-2xl">
                <FiMusic className="text-white text-5xl" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              No divine melodies found 🎵
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
              Try searching for different bhakti songs or check your internet connection
            </p>
            <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
              Explore All Songs
            </button>
          </div>
        )}
      </main>

      {/* Selected Song Modal */}
      {selectedSong && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSong(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedSong.image}
              alt={selectedSong.title}
              className="w-full h-64 object-cover rounded-xl mb-4"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image'
              }}
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedSong.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {selectedSong.subtitle || selectedSong.artist}
            </p>
            {selectedSong.album && (
              <p className="text-sm text-gray-500 mb-4">
                Album: {selectedSong.album}
              </p>
            )}
            <div className="flex space-x-4">
              <button 
                onClick={() => handlePlaySong(selectedSong)}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <FiPlay />
                <span>Play</span>
              </button>
              <button
                onClick={() => setSelectedSong(null)}
                className="px-6 py-3 border-2 border-gray-300 rounded-full font-semibold hover:bg-gray-100 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Player */}
      {showAudioPlayer && currentPlayingSong && (
        <AudioPlayer
          currentSong={currentPlayingSong}
          playlist={songs}
          onClose={handleCloseAudioPlayer}
          onSongChange={handleSongChange}
        />
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-3 rounded-full">
                <FiMusic className="text-white text-3xl" />
              </div>
            </div>
            <h4 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Bhakti Songs
            </h4>
            <p className="text-gray-600 text-lg">
              🙏 Experience Divine Music Anywhere, Anytime
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Progressive Web App</h5>
              <p className="text-sm text-gray-600">Install on your device for quick access</p>
            </div>
            <div className="text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Works Offline</h5>
              <p className="text-sm text-gray-600">Listen to your favorites without internet</p>
            </div>
            <div className="text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">🎵</span>
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Hindi Devotional</h5>
              <p className="text-sm text-gray-600">Authentic bhakti songs and mantras</p>
            </div>
          </div>
          
          <div className="text-center border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">
              Made with ❤️ for spiritual music lovers • © 2025 Bhakti Songs
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
