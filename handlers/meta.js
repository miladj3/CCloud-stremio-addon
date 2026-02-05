const { fetchDetails } = require('../lib/api')

/**
 * Meta Handler
 * Returns detailed information for a specific item
 */
async function metaHandler({ type, id }) {
    // Remove the 'ccloud:' prefix to get the actual ID
    const actualId = id.replace('ccloud:', '')

    const details = await fetchDetails(type, actualId)

    const meta = {
        id: id,  // Keep the full ID with prefix
        type: type,
        name: details.title,
        poster: details.poster,
        background: details.background,
        description: details.description,
        year: details.year,
        genres: details.genres,
        runtime: details.runtime,
    }

    // For series, add videos (episodes)
    if (type === 'series' && details.videos) {
        meta.videos = details.videos.map(video => ({
            id: `ccloud:${video.id}`,
            title: video.title,
            season: video.season,
            episode: video.episode,
            // Optional:
            // thumbnail: video.thumbnail,
            // overview: video.overview,
            // released: video.releaseDate,  // ISO 8601 format
        }))
    }

    return { meta }
}

module.exports = metaHandler
