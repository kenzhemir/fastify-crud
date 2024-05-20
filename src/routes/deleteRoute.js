const HTTP_STATUS_DELETED = 200;
const HTTP_STATUS_NO_CONTENT = 204;
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
  const deleteRoute = configuration.defaultRouteParams
    ? structuredClone(configuration.defaultRouteParams)
    : {};

  deleteRoute.url = `${configuration.baseUrl}/:id`;
  deleteRoute.method = HTTP_METHOD_DELETE;
  if (configuration.schemas?.IdParam) {
    if (!deleteRoute.schema) {
      deleteRoute.schema = {};
    }
    deleteRoute.schema.params = {
      id: configuration.schemas.IdParam,
    };
  }
  deleteRoute.handler = async function deleteRouteHandler(req, res) {
    const numberOfDeletedItems = await configuration.delete(req, req.params.id);

    res.status(
      numberOfDeletedItems > 0 ? HTTP_STATUS_DELETED : HTTP_STATUS_NO_CONTENT
    );
  };

  fastify.route(deleteRoute);
  done();
}
