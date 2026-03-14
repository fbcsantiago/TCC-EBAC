const { defineConfig } = require('cypress')

module.exports = defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: false,
    json: true,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // plugins podem ser configurados aqui se necessário
      return config
    },
    baseUrl: 'http://lojaebac.ebaconline.art.br/',
    env: {
      apiUrl: 'https://serverest.dev'
    }
  },
})

