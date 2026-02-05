const { toStremioStreams } = require('../lib/api')
const { movieSourcesCache, episodeSourcesCache } = require('../lib/cache')

/**
 * Stream Handler
 * Returns playable stream URLs
 */
async function streamHandler({ type, id }) {
    // Remove the 'ccloud:' prefix
    const actualId = id.replace('ccloud:', '')

    try {
        let sources = []

        if (type === 'movie') {
            // Get movie sources from cache
            sources = movieSourcesCache.get(actualId) || []
        } else if (type === 'series') {
            // For series, actualId is "seriesId:season:episode"
            sources = episodeSourcesCache.get(actualId) || []
        }

        if (sources.length === 0) {
            console.warn(`No sources found for ${type} ${actualId}`)
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
