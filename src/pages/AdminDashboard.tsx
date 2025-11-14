import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUpload, FiMusic, FiTrash2, FiLogOut, FiHome } from 'react-icons/fi';
import type { Song } from '../types';

interface UploadedAudio {
  id: string;
  title: string;
  artist: string;
  file: string; // Base64 data URL
  duration: string;
  uploadDate: string;
}

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [uploadedAudios, setUploadedAudios] = useState<UploadedAudio[]>([]);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Load uploaded audios from localStorage
    const stored = localStorage.getItem('uploadedAudios');
    if (stored) {
      setUploadedAudios(JSON.parse(stored));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setMessage({ type: '', text: '' });
    } else {
      setMessage({ type: 'error', text: 'Please select a valid audio file' });
      setAudioFile(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !artist || !audioFile) {
      setMessage({ type: 'error', text: 'Please fill in all fields and select an audio file' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      // Convert audio file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Audio = reader.result as string;

        // Get audio duration
        const audio = new Audio(base64Audio);
        await new Promise((resolve) => {
          audio.onloadedmetadata = resolve;
        });
        const duration = formatDuration(audio.duration);

        const newAudio: UploadedAudio = {
          id: Date.now().toString(),
          title,
          artist,
          file: base64Audio,
          duration,
          uploadDate: new Date().toISOString(),
        };

        const updatedAudios = [...uploadedAudios, newAudio];
        setUploadedAudios(updatedAudios);
        localStorage.setItem('uploadedAudios', JSON.stringify(updatedAudios));

        // Also update the songs list for home page
        const currentSongs = localStorage.getItem('customSongs');
        const songs: Song[] = currentSongs ? JSON.parse(currentSongs) : [];
        
        const newSong: Song = {
          id: newAudio.id,
          title: newAudio.title,
          subtitle: newAudio.artist,
          artist: newAudio.artist,
          image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
          url: newAudio.file,
          duration: newAudio.duration,
          album: 'Uploaded Audio',
        };

        songs.unshift(newSong);
        localStorage.setItem('customSongs', JSON.stringify(songs));

        setMessage({ type: 'success', text: 'Audio uploaded successfully!' });
        setTitle('');
        setArtist('');
        setAudioFile(null);
        (document.getElementById('audioFile') as HTMLInputElement).value = '';
      };

      reader.readAsDataURL(audioFile);
    } catch (error) {
      console.error('Error uploading audio:', error);
      setMessage({ type: 'error', text: 'Failed to upload audio. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    const updatedAudios = uploadedAudios.filter((audio) => audio.id !== id);
    setUploadedAudios(updatedAudios);
    localStorage.setItem('uploadedAudios', JSON.stringify(updatedAudios));

    // Remove from custom songs
    const currentSongs = localStorage.getItem('customSongs');
    if (currentSongs) {
      const songs: Song[] = JSON.parse(currentSongs);
      const updatedSongs = songs.filter((song) => song.id !== id);
      localStorage.setItem('customSongs', JSON.stringify(updatedSongs));
    }

    setMessage({ type: 'success', text: 'Audio deleted successfully!' });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-2 rounded-lg">
                <FiMusic className="text-white text-2xl" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FiHome />
                <span>Home</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiUpload className="mr-3 text-orange-500" />
            Upload Audio File
          </h2>

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-400 focus:outline-none transition-all"
                  placeholder="Enter song title"
                />
              </div>

              <div>
                <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-2">
                  Artist *
                </label>
                <input
                  id="artist"
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-400 focus:outline-none transition-all"
                  placeholder="Enter artist name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="audioFile" className="block text-sm font-medium text-gray-700 mb-2">
                Audio File * (MP3, WAV, OGG, etc.)
              </label>
              <input
                id="audioFile"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-400 focus:outline-none transition-all"
              />
              {audioFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {message.text && (
              <div
                className={`px-4 py-3 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-600'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Audio'}
            </button>
          </form>
        </div>

        {/* Uploaded Audios List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiMusic className="mr-3 text-orange-500" />
            Uploaded Audio Files ({uploadedAudios.length})
          </h2>

          {uploadedAudios.length === 0 ? (
            <div className="text-center py-12">
              <FiMusic className="text-gray-300 text-6xl mx-auto mb-4" />
              <p className="text-gray-500">No audio files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {uploadedAudios.map((audio) => (
                <div
                  key={audio.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-3 rounded-lg">
                      <FiMusic className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{audio.title}</h3>
                      <p className="text-sm text-gray-600">by {audio.artist}</p>
                      <p className="text-xs text-gray-500">
                        Duration: {audio.duration} • Uploaded: {new Date(audio.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(audio.id)}
                    className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="Delete audio"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
