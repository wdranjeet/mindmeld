import { useState, useEffect, useCallback } from 'react'
import { FiSearch, FiPlay, FiHeart, FiMusic, FiWifi } from 'react-icons/fi'
import { searchSongs, getTrendingSongs } from './api'
import type { Song } from './types'
import './App.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)

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
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Divine Melodies 🙏
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and listen to beautiful Hindi bhakti songs. Experience devotional music anytime, anywhere - even offline!
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
          </div>
        )}

        {/* Songs Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {songs.map((song) => (
              <div
                key={song.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer group"
                onClick={() => setSelectedSong(song)}
              >
                <div className="relative">
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <FiPlay className="text-orange-500 text-2xl" />
                    </button>
                  </div>
                  <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                    <FiHeart className="text-pink-500" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 truncate mb-1">
                    {song.title}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {song.subtitle || song.artist}
                  </p>
                  {song.duration && (
                    <p className="text-xs text-gray-500 mt-2">
                      {song.duration}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && songs.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiMusic className="text-white text-4xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No songs found
            </h3>
            <p className="text-gray-600">
              Try searching for different bhakti songs or check your internet connection
            </p>
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
              <button className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2">
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

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            🙏 Bhakti Songs - Experience Divine Music Anywhere
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Works offline • Progressive Web App • Hindi Devotional Songs
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
