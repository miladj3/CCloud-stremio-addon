const { toStremioStreams, search, fetchSeasons } = require('../lib/api')
const { movieSourcesCache, episodeSourcesCache, itemCache } = require('../lib/cache')

/**
 * Fetch movie/series title from Cinemeta using IMDB ID
 */
async function fetchTitleFromCinemeta(type, imdbId) {
    try {
        const url = `https://v3-cinemeta.strem.io/meta/${type}/${imdbId}.json`
        const response = await fetch(url)
        if (!response.ok) return null
        const data = await response.json()
        return data.meta?.name || null
    } catch (error) {
        console.error('Cinemeta fetch error:', error.message)
        return null
    }
}

/**
 * Search CCloud for a title and return movie sources
 */
async function findMovieSourcesByTitle(title) {
    const results = await search(title)
    const filtered = results.filter(item => item.type === 'movie')

    if (filtered.length === 0) return []

    const match = filtered[0]
    const itemId = match.id.toString()
    itemCache.set(itemId, match)

    if (match.sources && match.sources.length > 0) {
        movieSourcesCache.set(itemId, match.sources)
        return match.sources
    }

    return []
}

/**
 * Search CCloud for a series title and return episode sources
 */
async function findEpisodeSourcesByTitle(title, season, episode) {
    const results = await search(title)
    const filtered = results.filter(item => item.type === 'serie')

    if (filtered.length === 0) {
        console.log(`No series found for title: ${title}`)
        return []
    }

    const match = filtered[0]
    const seriesId = match.id
    console.log(`Found series: ${match.title} (ID: ${seriesId}), looking for S${season}E${episode}`)

    // Fetch seasons to get episode sources
    const seasons = await fetchSeasons(seriesId)
    if (!seasons || seasons.length === 0) {
        console.log(`No seasons found for series ${seriesId}`)
        return []
    }

    console.log(`Seasons count: ${seasons.length}`)

    // Find the matching season (season index is 0-based in API)
    const seasonData = seasons[season - 1]
    if (!seasonData || !seasonData.episodes) {
        console.log(`Season ${season} not found (available: ${seasons.length} seasons)`)
        return []
    }

    // Filter out trailers (تیزر) - they are not actual episodes
    const actualEpisodes = seasonData.episodes.filter(ep => ep.title !== 'تیزر')
    console.log(`Season ${season} has ${actualEpisodes.length} episodes (${seasonData.episodes.length - actualEpisodes.length} trailers filtered)`)

    // Find the matching episode (episode index is 0-based)
    const episodeData = actualEpisodes[episode - 1]
    if (!episodeData) {
        console.log(`Episode ${episode} not found in season ${season}`)
        return []
    }

    console.log(`Episode data:`, JSON.stringify(episodeData).substring(0, 500))

    if (!episodeData.sources || episodeData.sources.length === 0) {
        console.log(`No sources found for S${season}E${episode}`)
        return []
    }

    console.log(`Found ${episodeData.sources.length} sources, first source:`, JSON.stringify(episodeData.sources[0]))

    // Cache for future use
    const cacheKey = `${seriesId}:${season}:${episode}`
    episodeSourcesCache.set(cacheKey, episodeData.sources)

    return episodeData.sources
}

/**
 * Stream Handler
 * Returns playable stream URLs
 */
async function streamHandler({ type, id }) {
    try {
        let sources = []

        // Handle IMDB IDs from other addons
        if (id.startsWith('tt')) {
            // For movies: tt1234567
            // For series episodes: tt1234567:1:1 (imdbId:season:episode)
            const parts = id.split(':')
            const imdbId = parts[0]

            const title = await fetchTitleFromCinemeta(type, imdbId)
            if (title) {
                if (type === 'movie') {
                    sources = await findMovieSourcesByTitle(title)
                } else if (type === 'series' && parts.length >= 3) {
                    const season = parseInt(parts[1])
                    const episode = parseInt(parts[2])
                    sources = await findEpisodeSourcesByTitle(title, season, episode)
                }
            }
        }
        // Handle CCloud IDs
        else {
            const actualId = id.replace('ccloud:', '')
            console.log(`[CCloud] Stream request: type=${type}, actualId=${actualId}`)

            if (type === 'movie') {
                sources = movieSourcesCache.get(actualId) || []
                console.log(`[CCloud] Movie sources from cache: ${sources.length}`)
            } else if (type === 'series') {
                sources = episodeSourcesCache.get(actualId) || []
                console.log(`[CCloud] Episode sources from cache: ${sources.length}`)
            }

            if (sources.length > 0) {
                console.log(`[CCloud] First source:`, JSON.stringify(sources[0]))
            }
        }

        if (sources.length === 0) {
            console.log(`[CCloud] No sources found for ${type} ${id}`)
            return { streams: [] }
        }

        // Convert to Stremio stream format
        const streams = toStremioStreams(sources)

        // Sort by quality (highest first)
        streams.sort((a, b) => {
            const qualityOrder = { '4K': 4, '2160p': 4, '1080p': 3, '720p': 2, '480p': 1, '360p': 0 }
            const aOrder = qualityOrder[a.quality] ?? -1
            const bOrder = qualityOrder[b.quality] ?? -1
            return bOrder - aOrder
        })

        return { streams }
    } catch (error) {
        console.error('Stream error:', error.message)
        return { streams: [] }
    }
}

module.exports = streamHandler
