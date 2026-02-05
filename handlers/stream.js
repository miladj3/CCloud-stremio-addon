const { fetchStream } = require('../lib/api')

/**
 * Stream Handler
 * Returns playable stream URLs
 */
async function streamHandler({ type, id }) {
    // Remove the 'ccloud:' prefix
    const actualId = id.replace('ccloud:', '')

    // For series, the id might be like "series-1:1:1" (seriesId:season:episode)
    const streamData = await fetchStream(type, actualId)

    // Return array of streams (can have multiple sources)
    const streams = [
        {
            name: 'CCloud',
            title: streamData.title || 'Play',
            url: streamData.url,

            // Optional: Add more info
            // description: 'HD Quality',

            // For different stream types:
            // Direct URL:
            // url: 'https://example.com/video.mp4'

            // YouTube:
            // ytId: 'VIDEO_ID'

            // External player (opens in browser):
            // externalUrl: 'https://example.com/player'

            // Torrent:
            // infoHash: 'TORRENT_HASH'
            // fileIdx: 0  // File index in torrent
        }
    ]

    // You can return multiple streams for different qualities/sources
    // Example with multiple qualities:
    /*
    if (streamData.qualities) {
        return {
            streams: streamData.qualities.map(q => ({
                name: 'CCloud',
                title: q.label,  // e.g., '720p', '1080p'
                url: q.url
            }))
        }
    }
    */

    return { streams }
}

module.exports = streamHandler
