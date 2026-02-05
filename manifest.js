module.exports = {
    id: 'community.ccloud',
    version: '1.0.0',
    name: 'CCloud',
    description: 'CCloud Addon for Stremio',

    // Types of content this addon provides
    types: ['movie', 'series'],

    // Resources/handlers this addon implements
    resources: [
        'catalog',
        'meta',
        'stream'
    ],

    // Custom ID prefix - all your content IDs will be prefixed with this
    idPrefixes: ['ccloud:'],

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
    // logo: 'https://your-domain.com/logo.png',

    // Optional: background image
    // background: 'https://your-domain.com/background.jpg'
}
