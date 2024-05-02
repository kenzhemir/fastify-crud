const HTTP_STATUS_UPDATED = 200;
const HTTP_METHOD_UPDATE = "PATCH";

/**
 * This function registers POST /resources route
 * @param {FastifyInstance} fastify
 * @param {import('../configuration').Configuration} configuration
 * @returns
 */
export default function updateRoute(fastify, configuration, done) {
  if (!configuration.update) {
    return done();
  }
  const updateRoute = configuration.defaultRouteParams ?? {};

  updateRoute.url = `${configuration.baseUrl}/:id`;
  updateRoute.method = HTTP_METHOD_UPDATE;
  const schema = {};
  if (configuration.schemas?.UpdateBody) {
    schema.body = configuration.schemas.UpdateBody
  }
  if (configuration.schemas?.IdParam) {
    schema.params = {
      id: configuration.schemas.IdParam,
    };
  }
  if (Object.keys(schema).length) {
    updateRoute.schema = schema;
  }
  updateRoute.handler = async function updateRouteHandler(req, res) {
    const resource = await configuration.update(req.params.id, req.body);
    res.status(HTTP_STATUS_UPDATED);
    if (typeof resource === "object") {
      res.type("application/json");
    }
    res.send(JSON.stringify(resource));
  };

  fastify.route(updateRoute);
  done();
}
