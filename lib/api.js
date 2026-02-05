/**
 * CCloud API Integration Layer
 * Based on the Kotlin repository implementations
 */

const API_KEY = '4F5A9C3D9A86FA54EACEDDD635185'
const PRIMARY_SERVER = 'https://server-hi-speed-iran.info'
const HELPER_SERVERS = [
    'https://hostinnegar.com',
    'https://windowsdiba.info'
]

/**
 * Execute request with fallback to helper servers
 */
async function executeRequest(primaryUrl) {
    // Try primary server first
    try {
        const response = await fetch(primaryUrl, { timeout: 30000 })
        if (response.ok) {
            return await response.json()
        }
        throw new Error(`Primary server returned: ${response.status}`)
    } catch (primaryError) {
        // Try helper servers
        for (const helperServer of HELPER_SERVERS) {
            try {
                const helperUrl = primaryUrl.replace(/^https?:\/\/[^/]+/, helperServer)
                const response = await fetch(helperUrl, { timeout: 30000 })
                if (response.ok) {
                    return await response.json()
                }
            } catch (helperError) {
                continue
            }
        }
        throw primaryError
    }
}

/**
 * Fetch movies list
 * @param {number} page - Page number (0-indexed)
 * @param {number} genreId - Genre ID (0 for all)
 * @param {string} filterType - 'created', 'year', or 'imdb'
 */
async function fetchMovies(page = 0, genreId = 0, filterType = 'created') {
    const url = `${PRIMARY_SERVER}/api/movie/by/filtres/${genreId}/${filterType}/${page}/${API_KEY}`
    return await executeRequest(url)
}

/**
 * Fetch series list
 * @param {number} page - Page number (0-indexed)
 * @param {number} genreId - Genre ID (0 for all)
 * @param {string} filterType - 'created', 'year', or 'imdb'
 */
async function fetchSeries(page = 0, genreId = 0, filterType = 'created') {
    const url = `${PRIMARY_SERVER}/api/serie/by/filtres/${genreId}/${filterType}/${page}/${API_KEY}`
    return await executeRequest(url)
}

/**
 * Fetch seasons and episodes for a series
 * @param {number} seriesId - Series ID
 */
async function fetchSeasons(seriesId) {
    const url = `${PRIMARY_SERVER}/api/season/by/serie/${seriesId}/${API_KEY}/`
    return await executeRequest(url)
}

/**
 * Search for movies and series
 * @param {string} query - Search query
 */
async function search(query) {
    const encodedQuery = encodeURIComponent(query).replace(/%20/g, '%20')
    const url = `${PRIMARY_SERVER}/api/search/${encodedQuery}/${API_KEY}/`
    const result = await executeRequest(url)
    return result.posters || []
}

/**
 * Fetch all genres
 */
async function fetchGenres() {
    const url = `${PRIMARY_SERVER}/api/genre/all/${API_KEY}`
    return await executeRequest(url)
}

/**
 * Fetch all countries
 */
async function fetchCountries() {
    const url = `${PRIMARY_SERVER}/api/country/all/${API_KEY}/`
    return await executeRequest(url)
}

/**
 * Fetch posters by country
 * @param {number} countryId - Country ID
 * @param {number} page - Page number
 * @param {string} filterType - 'created', 'year', or 'imdb'
 */
async function fetchPostersByCountry(countryId, page = 0, filterType = 'created') {
    const url = `${PRIMARY_SERVER}/api/poster/by/filtres/0/${countryId}/${filterType}/${page}/${API_KEY}`
    return await executeRequest(url)
}

/**
 * Transform API movie/series to Stremio meta format
 */
function toStremioMeta(item, type) {
    return {
        id: item.id,
        type: type,
        name: item.title,
        poster: item.image,
        background: item.cover,
        description: item.description,
        year: item.year,
        imdbRating: item.imdb ? item.imdb.toString() : undefined,
        genres: item.genres ? item.genres.map(g => g.title) : [],
        runtime: item.duration,
        country: item.country ? item.country.map(c => c.title).join(', ') : undefined
    }
}

/**
 * Transform seasons/episodes to Stremio videos format
 */
function toStremioVideos(seasons, seriesId) {
    const videos = []

    seasons.forEach((season, seasonIndex) => {
        const seasonNum = seasonIndex + 1

        if (season.episodes && season.episodes.length > 0) {
            season.episodes.forEach((episode, episodeIndex) => {
                const episodeNum = episodeIndex + 1
                videos.push({
                    id: `${seriesId}:${seasonNum}:${episodeNum}`,
                    title: episode.title || `Episode ${episodeNum}`,
                    season: seasonNum,
                    episode: episodeNum,
                    thumbnail: episode.image || undefined,
                    overview: episode.description || undefined,
                    // Store sources for stream handler
                    _sources: episode.sources || []
                })
            })
        }
    })

    return videos
}

/**
 * Get streams from sources array
 */
function toStremioStreams(sources) {
    if (!sources || sources.length === 0) {
        return []
    }

    return sources.map(source => ({
        name: 'CCloud',
        title: `${source.quality || 'Unknown'} - ${source.type || 'Stream'}`,
        url: source.url,
        quality: source.quality
    }))
}

module.exports = {
    API_KEY,
    PRIMARY_SERVER,
    HELPER_SERVERS,
    executeRequest,
    fetchMovies,
    fetchSeries,
    fetchSeasons,
    search,
    fetchGenres,
    fetchCountries,
    fetchPostersByCountry,
    toStremioMeta,
    toStremioVideos,
    toStremioStreams
}
