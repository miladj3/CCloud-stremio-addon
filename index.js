const { addonBuilder, serveHTTP } = require('stremio-addon-sdk')
const manifest = require('./manifest')
const catalogHandler = require('./handlers/catalog')
const metaHandler = require('./handlers/meta')
const streamHandler = require('./handlers/stream')

const builder = new addonBuilder(manifest)

// Catalog: Returns list of items for the main screen
builder.defineCatalogHandler(catalogHandler)

// Meta: Returns item details when clicked
builder.defineMetaHandler(metaHandler)

// Stream: Returns playable URLs (shown in addon dropdown)
builder.defineStreamHandler(streamHandler)

// Start the server
const PORT = process.env.PORT || 7001

serveHTTP(builder.getInterface(), { port: PORT })

console.log(`
  CCloud Addon running at: http://localhost:${PORT}

  Install in Stremio:
    Settings → Addons → Enter: http://localhost:${PORT}/manifest.json
`)
