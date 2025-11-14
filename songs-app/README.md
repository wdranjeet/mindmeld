# Divine Melodies 🙏 - Hindi Bhakti Songs App

A modern, progressive web application for listening to Hindi bhakti songs and devotional music. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🎵 **Browse & Search**: Discover Hindi bhakti songs easily
- 📱 **Mobile First**: Responsive design works perfectly on all devices
- 💾 **Offline Support**: PWA technology allows offline usage
- 🎨 **Modern UI**: Eye-catching, gradient-based design
- 🔍 **Easy Search**: Quick search functionality for songs and artists
- 🎧 **Free API**: Uses JioSaavn API for Hindi devotional songs
- 🌐 **Online/Offline Indicator**: Shows connection status
- ⚡ **Fast & Optimized**: Built with Vite for excellent performance

## Technologies Used

- **React 19** - Latest version of the modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Latest utility-first styling framework
- **Vite 7** - Fast build tool and dev server
- **PWA** - Progressive Web App support with vite-plugin-pwa
- **Workbox** - Service worker for offline caching
- **React Icons** - Beautiful icons
- **Axios** - HTTP client for API calls

## Installation

```bash
cd songs-app
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

The production-ready files will be generated in the `dist` folder.

## Preview Production Build

```bash
npm run preview
```

## Linting

```bash
npm run lint
```

## PWA Features

- ✅ Works offline after first visit
- ✅ Installable on mobile devices
- ✅ Caches API responses for offline access
- ✅ Service worker for background sync
- ✅ App-like experience on mobile

## Usage

1. Open the app in your browser
2. Browse trending Hindi bhakti songs on the homepage
3. Use the search bar to find specific songs or artists
4. Click on any song card to view details
5. Install the app on your mobile device for offline access:
   - **On Android**: Tap the "Install" banner or use the menu option
   - **On iOS**: Tap the Share button and select "Add to Home Screen"

## Deployment

This app can be deployed to any static hosting service:

### Deploy to Vercel

```bash
npm install -g vercel
cd songs-app
vercel --prod
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
cd songs-app
npm run build
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

1. Update `vite.config.ts` to set the base path:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

2. Build and deploy:
```bash
npm run build
# Deploy the dist folder to gh-pages branch
```

## API Information

The app uses the JioSaavn API for fetching Hindi bhakti songs. If the API is unavailable, it falls back to mock data with popular bhakti songs.

## Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## License

MIT
