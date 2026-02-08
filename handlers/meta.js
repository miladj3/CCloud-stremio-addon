const { fetchSeasons, toStremioMeta, toStremioVideos } = require('../lib/api')
const { itemCache, episodeSourcesCache } = require('../lib/cache')

/**
 * Meta Handler
 * Returns detailed information for a specific item
 */
async function metaHandler({ type, id }) {
    // Remove the 'ccloud:' prefix to get the actual ID
    const actualId = id.replace('ccloud:', '')

    try {
        // Try to get cached item data
        const cachedItem = itemCache.get(actualId)

        if (!cachedItem) {
            // If not cached, return minimal meta
            // This shouldn't happen often as catalog is usually called first
            console.warn(`Item ${actualId} not in cache`)
            return {
                meta: {
                    id: id,
                    type: type,
                    name: 'Unknown',
                    poster: '',
                    description: 'Item details not available. Please browse the catalog first.'
                }
            }
        }

        // Build meta from cached data
        const stremioMeta = toStremioMeta(cachedItem, type)
        const meta = {
            id: id,
            type: type,
            name: stremioMeta.name,
            poster: stremioMeta.poster,
            background: stremioMeta.background,
            description: stremioMeta.description,
            year: stremioMeta.year,
            genres: stremioMeta.genres,
            runtime: stremioMeta.runtime,
            director: stremioMeta.director,
            cast: stremioMeta.cast
        }

        // Add country at the end of description
        if (cachedItem.country && cachedItem.country.length > 0) {
            const countryNames = cachedItem.country.map(c => c.title).join(', ')
            meta.description = (meta.description || '') + `\n\n\n\nمحصول کشور ${countryNames}\n\n`
        }

        // For series, fetch seasons and episodes
        if (type === 'series') {
            try {
                const seasons = await fetchSeasons(parseInt(actualId))
                console.log(`[Meta] Series ${actualId}: fetched ${seasons.length} seasons`)

                const videos = toStremioVideos(seasons, actualId)
                console.log(`[Meta] Total videos: ${videos.length}`)

                // Cache episodes with their sources for stream handler
                videos.forEach(video => {
                    if (video._sources && video._sources.length > 0) {
                        const cacheKey = `${actualId}:${video.season}:${video.episode}`
                        console.log(`[Meta] Caching ${cacheKey} with ${video._sources.length} sources`)
                        episodeSourcesCache.set(cacheKey, video._sources)
                    }
                })

                // Remove internal _sources before returning
                const finalVideos = videos.map(({ _sources, ...video }) => ({
                    ...video,
                    id: `ccloud:${video.id}`
                }))
                console.log(`[Meta] First 3 video IDs:`, finalVideos.slice(0, 3).map(v => v.id))
                meta.videos = finalVideos
            } catch (error) {
                console.error('Error fetching seasons:', error.message)
                meta.videos = []
            }
        }

        return { meta }
    } catch (error) {
        console.error('Meta error:', error.message)
        return {
            meta: {
                id: id,
                type: type,
                name: 'Error',
                description: 'Failed to load item details'
            }
        }
    }
}

module.exports = metaHandler
