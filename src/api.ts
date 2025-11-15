import axios from 'axios';
import type { Song, SearchResult, JioSaavnApiResponse, JioSaavnSong } from './types';

// Using JioSaavn API proxy (free API for Indian music)
const API_BASE_URL = 'https://jiosaavn-api-privatecvc.vercel.app';

// Better mock URLs with working audio samples
const workingAudioUrls = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
];

// Mock data for when API is unavailable
const mockBhaktiSongs: Song[] = [
  {
    id: '1',
    title: 'Hanuman Chalisa',
    subtitle: 'Hariharan',
    image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=300&h=300&fit=crop',
    url: workingAudioUrls[0],
    duration: '8:30',
    artist: 'Hariharan',
    album: 'Devotional Classics'
  },
  {
    id: '2',
    title: 'Shiv Tandav Stotram',
    subtitle: 'Shankar Mahadevan',
    image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1a65b57?w=300&h=300&fit=crop',
    url: workingAudioUrls[1],
    duration: '7:45',
    artist: 'Shankar Mahadevan',
    album: 'Shiva Bhajans'
  },
  {
    id: '3',
    title: 'Om Jai Jagdish Hare',
    subtitle: 'Anuradha Paudwal',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=300&fit=crop',
    url: workingAudioUrls[2],
    duration: '5:20',
    artist: 'Anuradha Paudwal',
    album: 'Aarti Collection'
  },
  {
    id: '4',
    title: 'Gayatri Mantra',
    subtitle: 'Suresh Wadkar',
    image: 'https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=300&h=300&fit=crop',
    url: workingAudioUrls[3],
    duration: '4:15',
    artist: 'Suresh Wadkar',
    album: 'Vedic Mantras'
  },
  {
    id: '5',
    title: 'Krishna Bhajan',
    subtitle: 'Jagjit Singh',
    image: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=300&h=300&fit=crop',
    url: workingAudioUrls[4],
    duration: '6:30',
    artist: 'Jagjit Singh',
    album: 'Krishna Leela'
  },
  {
    id: '6',
    title: 'Ram Dhun',
    subtitle: 'Lata Mangeshkar',
    image: 'https://images.unsplash.com/photo-1614853316476-de00d14cb1fc?w=300&h=300&fit=crop',
    url: workingAudioUrls[0],
    duration: '5:45',
    artist: 'Lata Mangeshkar',
    album: 'Ram Bhajans'
  },
  {
    id: '7',
    title: 'Durga Chalisa',
    subtitle: 'Kavita Krishnamurthy',
    image: 'https://images.unsplash.com/photo-1582726411144-deaeb0b4e6ed?w=300&h=300&fit=crop',
    url: workingAudioUrls[1],
    duration: '9:00',
    artist: 'Kavita Krishnamurthy',
    album: 'Devi Bhajans'
  },
  {
    id: '8',
    title: 'Sai Baba Aarti',
    subtitle: 'S.P. Balasubrahmanyam',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=300&fit=crop',
    url: workingAudioUrls[2],
    duration: '7:15',
    artist: 'S.P. Balasubrahmanyam',
    album: 'Sai Darshan'
  },
  {
    id: '9',
    title: 'Mahamrityunjaya Mantra',
    subtitle: 'Ravindra Jain',
    image: 'https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?w=300&h=300&fit=crop',
    url: workingAudioUrls[3],
    duration: '11:20',
    artist: 'Ravindra Jain',
    album: 'Shiva Mantras'
  },
  {
    id: '10',
    title: 'Ganesh Aarti',
    subtitle: 'Shankar Mahadevan',
    image: 'https://images.unsplash.com/photo-1533387520709-752d83de3630?w=300&h=300&fit=crop',
    url: workingAudioUrls[4],
    duration: '4:50',
    artist: 'Shankar Mahadevan',
    album: 'Ganesh Vandana'
  },
  {
    id: '11',
    title: 'Lakshmi Aarti',
    subtitle: 'Anuradha Paudwal',
    image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=300&h=300&fit=crop',
    url: workingAudioUrls[0],
    duration: '5:10',
    artist: 'Anuradha Paudwal',
    album: 'Diwali Special'
  },
  {
    id: '12',
    title: 'Vishnu Sahasranama',
    subtitle: 'M.S. Subbulakshmi',
    image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1a65b57?w=300&h=300&fit=crop',
    url: workingAudioUrls[1],
    duration: '15:30',
    artist: 'M.S. Subbulakshmi',
    album: 'Vishnu Stotras'
  }
];

export const searchSongs = async (query: string): Promise<SearchResult> => {
  try {
    const response = await axios.get<JioSaavnApiResponse>(`${API_BASE_URL}/search/songs`, {
      params: {
        query: query || 'bhakti',
        page: 1,
        limit: 20
      },
      timeout: 5000
    });

    const songs: Song[] = response.data.data.results.map((item: JioSaavnSong, index: number) => ({
      id: item.id,
      title: item.name || item.title || '',
      subtitle: item.primaryArtists || item.subtitle || '',
      image: item.image?.[2]?.link || '',
      url: item.downloadUrl?.[4]?.link || workingAudioUrls[index % workingAudioUrls.length],
      duration: item.duration || '',
      artist: item.primaryArtists || item.artist || '',
      album: item.album?.name || ''
    }));

    return {
      songs,
      total: response.data.data.total || songs.length
    };
  } catch (error) {
    console.error('Error fetching songs:', error);
    // Return mock data if API fails
    const filteredSongs = query 
      ? mockBhaktiSongs.filter(song => 
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          (song.artist && song.artist.toLowerCase().includes(query.toLowerCase()))
        )
      : mockBhaktiSongs;
    
    return {
      songs: filteredSongs,
      total: filteredSongs.length
    };
  }
};

export const getTrendingSongs = async (): Promise<Song[]> => {
  try {
    const response = await axios.get<JioSaavnApiResponse>(`${API_BASE_URL}/search/songs`, {
      params: {
        query: 'hindi bhakti songs',
        page: 1,
        limit: 12
      },
      timeout: 5000
    });

    return response.data.data.results.map((item: JioSaavnSong, index: number) => ({
      id: item.id,
      title: item.name || item.title || '',
      subtitle: item.primaryArtists || item.subtitle || '',
      image: item.image?.[2]?.link || '',
      url: item.downloadUrl?.[4]?.link || workingAudioUrls[index % workingAudioUrls.length],
      duration: item.duration || '',
      artist: item.primaryArtists || item.artist || '',
      album: item.album?.name || ''
    }));
  } catch (error) {
    console.error('Error fetching trending songs:', error);
    // Return mock data if API fails
    return mockBhaktiSongs;
  }
};
