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

// Persian to English genre mapping
const GENRE_MAP = {
    'سریال های برتر': 'Top Series',
    'تازه های باحال': 'New Releases',
    'پیشنهاد سردبیر': 'Editor\'s Pick',
    'سریال های بروز شده': 'Updated Series',
    'کره ای': 'Korean',
    'ترکی': 'Turkish',
    'بهترین ها در 5 ماه گذشته': 'Best of Last 5 Months',
    'چینی ژاپنی': 'Chinese & Japanese',
    'مستند': 'Documentary',
    'آخر الزمانی': 'Apocalyptic',
    '250 برتر تاریخ': 'Top 250 of All Time',
    'اسکار 2024': 'Oscar 2024',
    'بیشترین دانلود ها': 'Most Downloaded',
    'هندی': 'Indian',
    'ترسناک': 'Horror',
    'جنگی': 'War',
    'خانوادگی': 'Family',
    'ماجراجویی': 'Adventure',
    'کمدی': 'Comedy',
    'جنایی': 'Crime',
    'معمایی': 'Mystery',
    'درام': 'Drama',
    'زندگی نامه': 'Biography',
    'ورزشی': 'Sport',
    'محبوب ترین ها': 'Most Popular',
    'علمی تخیلی': 'Sci-Fi',
    'فانتزی': 'Fantasy',
    'اکشن': 'Action',
    'هیجان انگیز': 'Thriller',
    'اسکار 2023': 'Oscar 2023',
    'مسابقات ورزشی': 'Sports Events',
    'کلاسیک': 'Classic',
    'تاریخی': 'Historical',
    'وسترن': 'Western',
    'موزیک': 'Music',
    'عاشقانه': 'Romance',
    'Talk-Show': 'Talk Show',
    'اسکار 2021': 'Oscar 2021',
    'آموزش زبان انگلیسی': 'English Learning',
    'پخش زنده': 'Live',
    'انیمیشن + انیمه': 'Animation & Anime',
    'پیشنهادی هفته': 'Weekly Pick',
    'صوتی': 'Audio',
    'زیر نویس انگلیسی': 'English Subtitle',
    'گلدن گلوب 2024': 'Golden Globe 2024',
    'اسکار 2025': 'Oscar 2025',
    'چینی': 'Chinese',
    'ژاپنی': 'Japanese'
}

/**
 * Translate Persian genre to English
 */
function translateGenre(persianGenre) {
    return GENRE_MAP[persianGenre] || persianGenre
}

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
 * Extract synopsis from description (خلاصه داستان section)
 */
function extractSynopsis(description) {
    if (!description) return ''

    // Look for "خلاصه داستان:" and extract everything after it
    const synopsisMarker = 'خلاصه داستان:'
    const synopsisIndex = description.indexOf(synopsisMarker)

    if (synopsisIndex !== -1) {
        let synopsis = description.substring(synopsisIndex + synopsisMarker.length)
        // Clean up: remove extra whitespace and newlines
        synopsis = synopsis.replace(/\r\n/g, '\n').replace(/\n{2,}/g, '\n').trim()
        return synopsis
    }

    // If no synopsis marker found, return cleaned description
    return description.replace(/\r\n/g, '\n').replace(/\n{2,}/g, '\n').trim()
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
        description: extractSynopsis(item.description),
        year: item.year,
        imdbRating: item.imdb ? item.imdb.toString() : undefined,
        genres: item.genres ? item.genres.map(g => translateGenre(g.title)) : [],
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
