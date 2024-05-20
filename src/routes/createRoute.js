const HTTP_STATUS_CREATED = 201;
const HTTP_METHOD_CREATE = "POST";

/**
 * This function registers POST /resources route
 * @param {FastifyInstance} fastify
 * @param {import('../configuration').Configuration} configuration
 * @returns
 */
export default function createRoute(fastify, configuration, done) {
  if (!configuration.create) {
    return done();
  }
  const createRoute = configuration.defaultRouteParams ?? {};

  createRoute.url = configuration.baseUrl;
  createRoute.method = HTTP_METHOD_CREATE;
  if (configuration.schemas?.CreateBody) {
    if (!createRoute.schema) {
      createRoute.schema = {};
    }
    createRoute.schema.body = configuration.schemas.CreateBody;
  }
  createRoute.handler = async function createRouteHandler(req, res) {
    const resource = await configuration.create(req, req.body);
    res.status(HTTP_STATUS_CREATED);
    if (typeof resource === "object") {
      res.type("application/json");
    }
    res.send(JSON.stringify(resource));
  };

  fastify.route(createRoute);
  done();
}
