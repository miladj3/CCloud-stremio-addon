const { fetchMovies, fetchSeries, search, getGenreId, toStremioMeta } = require('../lib/api')
const { itemCache, movieSourcesCache } = require('../lib/cache')

/**
 * Catalog Handler
 * Returns list of items shown on the main screen
 */
async function catalogHandler({ type, id, extra }) {
    const skip = extra?.skip ? parseInt(extra.skip) : 0
    const searchQuery = extra?.search || null
    const genreName = extra?.genre || null

    // Calculate page from skip (assuming ~20 items per page)
    const page = Math.floor(skip / 20)

    // Get genre ID if genre filter is specified
    let genreId = 0
    if (genreName) {
        genreId = await getGenreId(genreName) || 0
    }

    let items = []

    try {
        // Handle search
        if (searchQuery) {
            const results = await search(searchQuery)
            // Filter by type
            items = results.filter(item => {
                if (type === 'movie') return item.type === 'movie'
                if (type === 'series') return item.type === 'serie'
                return true
            })
        }
        // Handle catalog browsing
        else if (type === 'movie' && id === 'ccloud-movies') {
            items = await fetchMovies(page, genreId)
        } else if (type === 'series' && id === 'ccloud-series') {
            items = await fetchSeries(page, genreId)
        }

        // Transform to Stremio format and cache data
        const metas = items.map(item => {
            const itemId = item.id.toString()

            // Cache full item data for meta handler
            itemCache.set(itemId, item)

            // Cache movie sources for stream handler
            if (item.sources && item.sources.length > 0) {
                movieSourcesCache.set(itemId, item.sources)
            }

            const stremioType = item.type === 'serie' ? 'series' : type
            const meta = toStremioMeta(item, stremioType)

            return {
                id: `ccloud:${meta.id}`,
                type: stremioType,
                name: meta.name,
                poster: meta.poster,
                year: meta.year,
                description: meta.description
            }
        })

        return { metas }
    } catch (error) {
        console.error('Catalog error:', error.message)
        return { metas: [] }
    }
}

module.exports = catalogHandler
