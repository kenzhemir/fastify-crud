import createConfiguration from "./configuration.js";
import createRoute from "./routes/createRoute.js";
import readRoute from "./routes/readRoute.js";
import updateRoute from "./routes/updateRoute.js";
/**
 */
/**
 *
 *
 * @typedef {Object} Options
 * @property {string} baseUrl - This url is going to be used to create the routes
 * @property {Object} [defaultRouteParams] - Template for creating route
 * @property {Object} [schemas] - Validation schemas
 * @property {Object} [schemas.CreateBody] - Schema for validating resource for creation
 * @property {Object} [schemas.IdParam] - Schema for validating :id parameter
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
  fastify.register(readRoute, configuration, done);
  fastify.register(updateRoute, configuration, done);

  done();
}
