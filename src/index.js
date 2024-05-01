import createConfiguration from "./configuration.js";
import createRoute from "./routes/createRoute.js";
/**
 */
/**
 *
 *
 * @typedef {Object} Options
 * @property {string} baseUrl - This url is going to be used to create the routes
 * @property {Object} [defaultRouteParams] - Template for creating route
 * @property {(resource) => Promise<void>} [create] - This function will be used to create a resource for POST {baseUrl} calls
 *
 * @param {FastifyInstance} fastify - fastify instance
 * @param {Options} options - Options for fastify-crud plugin
 * @param {*} done
 */
export default function createCrudRoutes(fastify, options, done) {
  const { configuration, error } = createConfiguration(options);
  if (error) {
    return done(error);
  }

  fastify.register(createRoute, configuration, done);

  done();
}
