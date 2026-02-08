module.exports = {
    id: 'community.ccloud',
    version: '1.0.1',
    name: 'CCloud',
    description: 'CCloud Addon for Stremio',

    // Types of content this addon provides
    types: ['movie', 'series'],

    // Resources/handlers this addon implements
    resources: [
        'catalog',
        {
            name: 'meta',
            types: ['movie', 'series'],
            idPrefixes: ['ccloud:']
        },
        {
            name: 'stream',
            types: ['movie', 'series'],
            idPrefixes: ['ccloud:', 'tt']
        }
    ],

    idPrefixes: ['ccloud:', 'tt'],

    // Catalogs shown on the main screen
    catalogs: [
        {
            type: 'movie',
            id: 'ccloud-movies',
            name: 'CCloud Movies',
            extra: [
                {
                    name: 'genre',
                    isRequired: false,
                    options: [
                        'Action', 'Adventure', 'Animation & Anime', 'Biography', 'Comedy', 'Crime',
                        'Documentary', 'Drama', 'Family', 'Fantasy', 'Historical', 'Horror',
                        'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
                    ]
                },
                { name: 'search', isRequired: false },
                { name: 'skip', isRequired: false }
            ]
        },
        {
            type: 'series',
            id: 'ccloud-series',
            name: 'CCloud Series',
            extra: [
                {
                    name: 'genre',
                    isRequired: false,
                    options: [
                        'Action', 'Adventure', 'Animation & Anime', 'Biography', 'Comedy', 'Crime',
                        'Documentary', 'Drama', 'Family', 'Fantasy', 'Historical', 'Horror',
                        'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
                    ]
                },
                { name: 'search', isRequired: false },
                { name: 'skip', isRequired: false }
            ]
        }
    ],

    // Optional: addon logo
    logo: 'https://github.com/masooddalman/CCloud-stremio-addon/blob/main/assets/logo.png?raw=true',

    // Optional: background image
    // background: 'https://your-domain.com/background.jpg'
}
