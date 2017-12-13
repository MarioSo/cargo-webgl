/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 */
// var config = require('../../config.json')
// var port = (config.browsersync) ? config.browsersync.port : 3000

var port = 3000
// browser-sync start -s -b "google chrome" -f "./index.html" "public#<{(|.css" "src/js#<{(|*"

module.exports = {
  port: port,
  open: false,
  ghostMode: false,
  ui: false,
  logLevel: 'info',
  logConnections: true,
  logFileChanges: true,
  reloadDelay: 1000,
  reloadDebounce: 0,
  injectChanges: true,
  logSnippet: true,
  watchOptions: {
    usePolling: true
  },
  proxy: "localhost:8080",
  socket: {
    domain: 'localhost:' + port,
    port: port
  },
  files: [
    'public/main.css',
    'src/js/**/*.js'
  ]
}
