/**
 * Cache Manager - Handles cache busting and favicon refresh on new deployments
 *
 * This utility checks for a new build version and clears browser caches
 * including localStorage and favicon cache to ensure users see the latest assets.
 */

const VERSION_KEY = 'app_build_version';
const BUILD_VERSION = import.meta.env.VITE_BUILD_VERSION || 'dev';

/**
 * Clears favicon cache by appending a cache-busting query parameter
 * to all favicon link elements and reloading them
 */
function refreshFavicons(): void {
  const faviconSelectors = [
    'link[rel="icon"]',
    'link[rel="apple-touch-icon"]',
    'link[rel="shortcut icon"]',
  ];

  faviconSelectors.forEach(selector => {
    document.querySelectorAll<HTMLLinkElement>(selector).forEach(link => {
      const href = link.href.split('?')[0]; // Remove existing query params
      link.href = `${href}?v=${BUILD_VERSION}`;
    });
  });
}

/**
 * Clears specific cached data that should be refreshed on new deployments
 * Preserves user preferences and session data
 */
function clearStaleCache(): void {
  // Clear any asset-related cache entries
  const keysToPreserve = ['theme', 'language', 'user_preferences'];

  Object.keys(localStorage).forEach(key => {
    // Only clear cache-related keys, preserve user data
    if (key.startsWith('cache_') || key.startsWith('asset_')) {
      localStorage.removeItem(key);
    }
  });

  // Clear sessionStorage cache entries
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('cache_') || key.startsWith('asset_')) {
      sessionStorage.removeItem(key);
    }
  });
}

/**
 * Attempts to clear browser caches using the Cache API
 * This clears service worker and HTTP caches
 */
async function clearBrowserCaches(): Promise<void> {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('[CacheManager] Browser caches cleared');
    } catch (error) {
      console.warn('[CacheManager] Could not clear browser caches:', error);
    }
  }
}

/**
 * Main cache management function
 * Checks for new build version and clears caches if needed
 */
export async function initCacheManager(): Promise<void> {
  const storedVersion = localStorage.getItem(VERSION_KEY);

  if (storedVersion !== BUILD_VERSION) {
    console.log(`[CacheManager] New version detected: ${BUILD_VERSION} (was: ${storedVersion || 'none'})`);

    // Clear all caches
    clearStaleCache();
    await clearBrowserCaches();

    // Update stored version
    localStorage.setItem(VERSION_KEY, BUILD_VERSION);

    // Refresh favicons with new version
    refreshFavicons();

    console.log('[CacheManager] Cache refresh complete');
  } else {
    // Even on same version, ensure favicons have version param
    refreshFavicons();
  }
}

/**
 * Force cache refresh - can be called manually if needed
 */
export async function forceRefreshCache(): Promise<void> {
  localStorage.removeItem(VERSION_KEY);
  await initCacheManager();

  // Force reload the page to ensure all assets are fresh
  window.location.reload();
}

export { BUILD_VERSION };
