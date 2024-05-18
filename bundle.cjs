'use strict'

/**
 *
 * @typedef Configuration
 * @property {string} baseUrl - This url is going to be used to create the routes
 * @property {Object} [schemas] - Validation schemas
 * @property {Object} [schemas.IdParam] - Schema for validating :id parameter. Adding validation schema might change the argument type
 * @property {Object} [schemas.CreateBody] - Schema for validating resource for creation
 * @property {Object} [schemas.UpdateBody] - Schema for validating resource for update
 * @property {Object} [defaultRouteParams] - Template for creating route
 * @property {(ctx: Context, resource: TCreateBody) => Promise<unknown>} [create] - This function will be used to create a resource for POST {baseUrl} route
 * @property {(ctx: Context, resourceId: string | IdParam) => Promise<TResource>} [read] - This function will be used to read a resource for GET {baseUrl}/:id route
 * @property {(ctx: Context, resourceId: string | IdParam, resource: TUpdateBody) => Promise<TResource>} [update] - This function will be used to read a resource for PUT {baseUrl}/:id route
 * @property {(ctx: Context, resourceId: string | IdParam) => Promise<number>} [delete] - This function will be used to delete a resource for DELETE {baseUrl}/:id route
 *
 * @param {import('./index').Options} options
 * @returns {{
 *   configuration?: Configuration,
 *   error?: string
 * }}
 */
function createConfiguration (options) {
  if (!options.baseUrl) {
    return { error: 'No baseUrl found' }
  }

  /**
   * @type Configuration
   */
  const configuration = {}
  configuration.defaultRouteParams = options.defaultRouteParams
  configuration.baseUrl = formatBaseUrl(options.baseUrl)
  configuration.create = options.create
  configuration.read = options.read
  configuration.update = options.update
  configuration.delete = options.delete
  if (options.schemas) {
    configuration.schemas = {}
    configuration.schemas.CreateBody = options.schemas.CreateBody
    configuration.schemas.UpdateBody = options.schemas.UpdateBody
    configuration.schemas.IdParam = options.schemas.IdParam
  }

  return { configuration }
}

function formatBaseUrl (baseUrl) {
  if (baseUrl[0] !== '/') {
    baseUrl = '/' + baseUrl
  }
  if (baseUrl[baseUrl.length - 1] === '/') {
    baseUrl = baseUrl.substring(0, baseUrl.length - 1)
  }

  return baseUrl
}

const HTTP_STATUS_CREATED = 201
const HTTP_METHOD_CREATE = 'POST'

/**
 * This function registers POST /resources route
 * @param {FastifyInstance} fastify
 * @param {import('../configuration').Configuration} configuration
 * @returns
 */
function createRoute (fastify, configuration, done) {
  if (!configuration.create) {
    return done()
  }
  const createRoute = configuration.defaultRouteParams ?? {}

  createRoute.url = configuration.baseUrl
  createRoute.method = HTTP_METHOD_CREATE
  if (configuration.schemas?.CreateBody) {
    createRoute.schema = {
      body: configuration.schemas.CreateBody
    }
  }
  createRoute.handler = async function createRouteHandler (req, res) {
    const resource = await configuration.create(req, req.body)
    res.status(HTTP_STATUS_CREATED)
    if (typeof resource === 'object') {
      res.type('application/json')
    }
    res.send(JSON.stringify(resource))
  }

  fastify.route(createRoute)
  done()
}

const HTTP_STATUS_DELETED = 200
const HTTP_STATUS_NO_CONTENT = 204
const HTTP_METHOD_DELETE = 'DELETE'

/**
 * This function registers POST /resources route
 * @param {FastifyInstance} fastify
 * @param {import('../configuration').Configuration} configuration
 * @returns
 */
function deleteRoute (fastify, configuration, done) {
  if (!configuration.delete) {
    return done()
  }
  const deleteRoute = configuration.defaultRouteParams ?? {}

  deleteRoute.url = `${configuration.baseUrl}/:id`
  deleteRoute.method = HTTP_METHOD_DELETE
  if (configuration.schemas?.IdParam) {
    deleteRoute.schema = {
      params: {
        id: configuration.schemas.IdParam
      }
    }
  }
  deleteRoute.handler = async function deleteRouteHandler (req, res) {
    const numberOfDeletedItems = await configuration.delete(req, req.params.id)

    res.status(
      numberOfDeletedItems > 0 ? HTTP_STATUS_DELETED : HTTP_STATUS_NO_CONTENT
    )
  }

  fastify.route(deleteRoute)
  done()
}

const HTTP_STATUS_READ = 200
const HTTP_METHOD_READ = 'GET'

/**
 * This function registers POST /resources route
 * @param {FastifyInstance} fastify
 * @param {import('../configuration').Configuration} configuration
 * @returns
 */
function readRoute (fastify, configuration, done) {
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

const HTTP_STATUS_UPDATED = 200
const HTTP_METHOD_UPDATE = 'PATCH'

/**
 * This function registers POST /resources route
 * @param {FastifyInstance} fastify
 * @param {import('../configuration').Configuration} configuration
 * @returns
 */
function updateRoute (fastify, configuration, done) {
  if (!configuration.update) {
    return done()
  }
  const updateRoute = configuration.defaultRouteParams ?? {}

  updateRoute.url = `${configuration.baseUrl}/:id`
  updateRoute.method = HTTP_METHOD_UPDATE
  const schema = {}
  if (configuration.schemas?.UpdateBody) {
    schema.body = configuration.schemas.UpdateBody
  }
  if (configuration.schemas?.IdParam) {
    schema.params = {
      id: configuration.schemas.IdParam
    }
  }
  if (Object.keys(schema).length) {
    updateRoute.schema = schema
  }
  updateRoute.handler = async function updateRouteHandler (req, res) {
    const resource = await configuration.update(req, req.params.id, req.body)
    res.status(HTTP_STATUS_UPDATED)
    if (typeof resource === 'object') {
      res.type('application/json')
    }
    res.send(JSON.stringify(resource))
  }

  fastify.route(updateRoute)
  done()
}

/**
 * Plugin to generate CRUD routes
 *
 * @typedef {Object} Options
 * @property {string} baseUrl - This url is going to be used to create the routes
 * @property {Object} [schemas] - Validation schemas
 * @property {Object} [schemas.IdParam] - Schema for validating :id parameter. Adding validation schema might change the argument type
 * @property {Object} [schemas.CreateBody] - Schema for validating resource for creation
 * @property {Object} [schemas.UpdateBody] - Schema for validating resource for update
 * @property {Object} [defaultRouteParams] - Template for creating route
 * @property {(ctx: Context, resource: TCreateBody) => Promise<unknown>} [create] - This function will be used to create a resource for POST {baseUrl} route
 * @property {(ctx: Context, resourceId: string | IdParam) => Promise<TResource>} [read] - This function will be used to read a resource for GET {baseUrl}/:id route
 * @property {(ctx: Context, resourceId: string | IdParam, resource: TUpdateBody) => Promise<TResource>} [update] - This function will be used to read a resource for PUT {baseUrl}/:id route
 * @property {(ctx: Context, resourceId: string | IdParam) => Promise<number>} [delete] - This function will be used to delete a resource for DELETE {baseUrl}/:id route
 *
 * @param {FastifyInstance} fastify - fastify instance
 * @param {Options} options - Options for fastify-crud plugin
 * @param {() => void} done
 */
function createCrudRoutes (fastify, options, done) {
  const { configuration, error } = createConfiguration(options)
  if (error) {
    return done(error)
  }

  fastify.register(createRoute, configuration, done)
  fastify.register(readRoute, configuration, done)
  fastify.register(updateRoute, configuration, done)
  fastify.register(deleteRoute, configuration, done)

  done()
}

module.exports = createCrudRoutes
