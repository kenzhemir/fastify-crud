const HTTP_STATUS_DELETE = 204;
const HTTP_METHOD_DELETE = "DELETE";

/**
 * This function registers POST /resources route
 * @param {FastifyInstance} fastify
 * @param {import('../configuration').Configuration} configuration
 * @returns
 */
export default function deleteRoute(fastify, configuration, done) {
  if (!configuration.delete) {
    return done();
  }
  const deleteRoute = configuration.defaultRouteParams ?? {};

  deleteRoute.url = `${configuration.baseUrl}/:id`;
  deleteRoute.method = HTTP_METHOD_DELETE;
  if (configuration.schemas?.IdParam) {
    deleteRoute.schema = {
      params: {
        id: configuration.schemas.IdParam,
      },
    };
  }
  deleteRoute.handler = async function deleteRouteHandler(req, res) {
    await configuration.delete(req.params.id);
    res.status(HTTP_STATUS_DELETE);
  };

  fastify.route(deleteRoute);
  done();
}
