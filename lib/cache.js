/**
 * Shared Cache Module
 * Stores item data and sources for use across handlers
 */

// Cache for full item data (movies/series) - keyed by ID
const itemCache = new Map()

// Cache for movie sources - keyed by movie ID
const movieSourcesCache = new Map()

// Cache for episode sources - keyed by "seriesId:season:episode"
const episodeSourcesCache = new Map()

/**
 * Clear all caches (useful for memory management)
 */
function clearAllCaches() {
    itemCache.clear()
    movieSourcesCache.clear()
    episodeSourcesCache.clear()
}

/**
 * Get cache stats
 */
function getCacheStats() {
    return {
        items: itemCache.size,
        movieSources: movieSourcesCache.size,
        episodeSources: episodeSourcesCache.size
    }
}

module.exports = {
    itemCache,
    movieSourcesCache,
    episodeSourcesCache,
    clearAllCaches,
    getCacheStats
}
