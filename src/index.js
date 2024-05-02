import createConfiguration from "./configuration.js";
import createRoute from "./routes/createRoute.js";
import deleteRoute from "./routes/deleteRoute.js";
import readRoute from "./routes/readRoute.js";
import updateRoute from "./routes/updateRoute.js";
/**
 */
/**
 *
 *
 * @typedef {Object} Options
 * @property {string} baseUrl - This url is going to be used to create the routes
 * @property {Object} [schemas] - Validation schemas
 * @property {Object} [schemas.IdParam] - Schema for validating :id parameter. Adding validation schema might change the argument type
 * @property {Object} [schemas.CreateBody] - Schema for validating resource for creation
 * @property {Object} [schemas.UpdateBody] - Schema for validating resource for update
 * @property {Object} [defaultRouteParams] - Template for creating route
 * @property {(resource: CreateBody) => Promise<void>} [create] - This function will be used to create a resource for POST {baseUrl} route
 * @property {(resourceId: string | IdParamSchema) => Promise<Resource>} [read] - This function will be used to read a resource for GET {baseUrl}/:id route
 * @property {(resourceId: string | IdParamSchema, resource: UpdateBody) => Promise<Resource>} [update] - This function will be used to read a resource for PUT {baseUrl}/:id route
 * @property {(resourceId: string | IdParamSchema) => Promise<void>} [delete] - This function will be used to delete a resource for DELETE {baseUrl}/:id route
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
  fastify.register(deleteRoute, configuration, done);

  done();
}
