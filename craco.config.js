const CracoLinariaPlugin = require('craco-linaria')

module.exports = {
  plugins: [
    {
      plugin: CracoLinariaPlugin,
      options: {
        // Linaria options
        displayName: process.env.NODE_ENV !== 'production'
      },
    },
  ],
}