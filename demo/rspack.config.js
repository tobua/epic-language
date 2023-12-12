import max from './api/count/[max].js'
// import staticEdge from './api/static/edge/[lang].ts'
import staticServerless from './api/static/serverless/[lang].js'

/** @type {import('@rspack/core').Configuration} */
export default {
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.get('/api/count/:max', max)
      devServer.app.get('/api/static/serverless/:lang', staticServerless)
      return middlewares
    },
  },
}
