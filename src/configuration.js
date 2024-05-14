/**
 *
 * @typedef Configuration
 * @property {string} baseUrl - This url is going to be used to create the routes
 * @property {Object} [schemas] - Validation schemas
 * @property {Object} [schemas.IdParam] - Schema for validating :id parameter. Adding validation schema might change the argument type
 * @property {Object} [schemas.CreateBody] - Schema for validating resource for creation
 * @property {Object} [schemas.UpdateBody] - Schema for validating resource for update
 * @property {Object} [defaultRouteParams] - Template for creating route
 * @property {(ctx: Context, resource: TCreateBody) => Promise<IdParam>} [create] - This function will be used to create a resource for POST {baseUrl} route
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
export default function createConfiguration (options) {
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
