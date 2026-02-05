/**
 * API Integration Layer
 *
 * Replace these functions with your actual API calls
 */

// Example: Fetch movies list from your API
async function fetchMovies(skip = 0, search = null) {
    // TODO: Replace with your actual API call
    // Example:
    // const response = await fetch('https://your-api.com/movies?skip=' + skip + '&search=' + search)
    // return response.json()

    // Placeholder data - remove this and add your API
    return [
        {
            id: 'movie-1',
            title: 'Example Movie 1',
            poster: 'https://via.placeholder.com/200x300?text=Movie+1',
            year: 2024
        },
        {
            id: 'movie-2',
            title: 'Example Movie 2',
            poster: 'https://via.placeholder.com/200x300?text=Movie+2',
            year: 2023
        }
    ]
}

// Example: Fetch series list from your API
async function fetchSeries(skip = 0, search = null) {
    // TODO: Replace with your actual API call

    // Placeholder data
    return [
        {
            id: 'series-1',
            title: 'Example Series 1',
            poster: 'https://via.placeholder.com/200x300?text=Series+1',
            year: 2024
        }
    ]
}

// Example: Fetch item details (movie or series)
async function fetchDetails(type, id) {
    // TODO: Replace with your actual API call
    // Example:
    // const response = await fetch(`https://your-api.com/${type}/${id}`)
    // return response.json()

    // Placeholder data
    if (type === 'movie') {
        return {
            id: id,
            title: 'Example Movie',
            description: 'This is an example movie description.',
            poster: 'https://via.placeholder.com/200x300?text=Movie',
            background: 'https://via.placeholder.com/1280x720?text=Background',
            year: 2024,
            genres: ['Action', 'Drama'],
            runtime: '2h 15min'
        }
    } else {
        // Series with episodes
        return {
            id: id,
            title: 'Example Series',
            description: 'This is an example series description.',
            poster: 'https://via.placeholder.com/200x300?text=Series',
            background: 'https://via.placeholder.com/1280x720?text=Background',
            year: 2024,
            genres: ['Drama', 'Thriller'],
            // Videos array for series episodes
            videos: [
                { season: 1, episode: 1, id: `${id}:1:1`, title: 'Pilot' },
                { season: 1, episode: 2, id: `${id}:1:2`, title: 'Episode 2' },
                { season: 1, episode: 3, id: `${id}:1:3`, title: 'Episode 3' }
            ]
        }
    }
}

// Example: Fetch stream URL
async function fetchStream(type, id) {
    // TODO: Replace with your actual API call
    // The id might be:
    // - For movies: "movie-1"
    // - For series episodes: "series-1:1:1" (seriesId:season:episode)

    // Example:
    // const response = await fetch(`https://your-api.com/stream/${type}/${id}`)
    // return response.json()

    // Placeholder - return your direct stream URL
    return {
        url: 'https://example.com/stream.mp4',
        title: 'CCloud Stream'
    }
}

module.exports = {
    fetchMovies,
    fetchSeries,
    fetchDetails,
    fetchStream
}
