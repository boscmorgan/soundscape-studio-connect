import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initCacheManager } from './lib/cacheManager'

// Initialize cache manager to handle version-based cache busting
initCacheManager();

createRoot(document.getElementById("root")!).render(<App />);
