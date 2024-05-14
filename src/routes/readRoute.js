const HTTP_STATUS_READ = 200
const HTTP_METHOD_READ = 'GET'

/**
 * This function registers POST /resources route
 * @param {FastifyInstance} fastify
 * @param {import('../configuration').Configuration} configuration
 * @returns
 */
export default function readRoute (fastify, configuration, done) {
  if (!configuration.read) {
    return done()
  }
  const readRoute = configuration.defaultRouteParams ?? {}

  readRoute.url = `${configuration.baseUrl}/:id`
  readRoute.method = HTTP_METHOD_READ
  if (configuration.schemas?.IdParam) {
    readRoute.schema = {
      params: {
        id: configuration.schemas.IdParam
      }
    }
  }
  readRoute.handler = async function readRouteHandler (req, res) {
    const resource = await configuration.read(req, req.params.id)
    res.status(HTTP_STATUS_READ)
    res.type('application/json')
    res.send(resource)
  }

  fastify.route(readRoute)
  done()
}
