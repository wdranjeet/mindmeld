# Quick Start Guide - Divine Melodies 🙏

## Getting Started in 3 Simple Steps

### 1. Install Dependencies
```bash
cd songs-app
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to [http://localhost:5173](http://localhost:5173)

---

## What You'll See

### Home Page
- **Header**: Search bar with online/offline indicator
- **Hero Section**: "Divine Melodies 🙏" with tagline
- **Songs Grid**: Beautiful cards showing Hindi bhakti songs

### Features to Try
1. **Search**: Type in the search bar to find songs
2. **Browse**: Scroll through trending bhakti songs
3. **Click Songs**: View details in a modal popup
4. **Responsive**: Resize browser to see mobile view

---

## Building for Production

```bash
npm run build
```

This creates optimized files in the `dist` folder ready for deployment.

---

## Installing as PWA on Mobile

### Android
1. Open the app in Chrome
2. Tap the "Install" banner or menu → "Add to Home Screen"
3. The app icon will appear on your home screen

### iOS
1. Open the app in Safari
2. Tap the Share button (square with arrow)
3. Select "Add to Home Screen"
4. Tap "Add"

---

## Testing Offline Mode

1. Open the app and browse some songs
2. Turn off your internet connection
3. Refresh the page or reopen the app
4. The app will still work with cached data!

---

## Troubleshooting

### Port Already in Use?
```bash
npm run dev -- --port 3000
```

### Node Modules Issues?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors?
```bash
npm run lint
npm run build
```

---

## Next Steps

- Customize the UI colors in `tailwind.config.js`
- Add more songs to mock data in `src/api.ts`
- Integrate different APIs in `src/api.ts`
- Deploy to Vercel, Netlify, or GitHub Pages

---

Enjoy your Divine Melodies! 🙏✨
