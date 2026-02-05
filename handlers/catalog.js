const { fetchMovies, fetchSeries } = require('../lib/api')

/**
 * Catalog Handler
 * Returns list of items shown on the main screen
 */
async function catalogHandler({ type, id, extra }) {
    const skip = extra?.skip ? parseInt(extra.skip) : 0
    const search = extra?.search || null

    let items = []

    if (type === 'movie' && id === 'ccloud-movies') {
        items = await fetchMovies(skip, search)
    } else if (type === 'series' && id === 'ccloud-series') {
        items = await fetchSeries(skip, search)
    }

    // Transform your API data to Stremio format
    const metas = items.map(item => ({
        id: `ccloud:${item.id}`,  // Prefix with ccloud:
        type: type,
        name: item.title,
        poster: item.poster,
        // Optional fields:
        year: item.year,
        // posterShape: 'regular',  // 'regular', 'landscape', or 'square'
        // description: item.description,
        // genres: item.genres,
    }))

    return { metas }
}

module.exports = catalogHandler
