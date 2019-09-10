const pkg = require('./package')

module.exports = {
  vue: {
    config: {
      productionTip: false,
      devtools: true
    }
  },

  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */

  css: ['@/assets/sass/app.sass'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
         './plugins/components',
         './plugins/mixins'
     ],

  router: {
        middleware: [
            'auth'
        ]
    },

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],

  auth: {
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: 'login',
                        method: 'post',
                        propertyName: 'meta.token'
                    },

                    user: {
                        url: 'me',
                        method: 'get',
                        propertyName: 'data'
                    },

                    logout: {
                        url: 'logout',
                        method: 'post'
                    }
                }
            },

            redirect: {
                login: 'login',
                logout: 'login',
                home: '/'
            }
        }
    },

  /*
  ** Axios module configuration
  */
  axios: {
    baseURL: 'http://backEnd.test/api'
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    }
  }
}
