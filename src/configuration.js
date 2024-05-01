/**
 *
 * @typedef Configuration
 * @property {string} baseUrl - This url is going to be used to create the routes
 * @property {Object} [schemas] - Validation schemas
 * @property {Object} [schemas.CreateBody] - Schema for validating resource for creation
 * @property {Object} [schemas.IdParam] - Schema for validating :id parameter. Adding validation schema might change the argument type
 * @property {Object} [defaultRouteParams] - Template for creating route
 * @property {(resource) => Promise<void>} [create] - This function will be used to create a resource for POST {baseUrl} route
 * @property {(resourceId: string | IdParamSchema) => Promise<Resource>} [read] - This function will be used to read a resource for GET {baseUrl}/:id route
 *
 * @param {import('./index').Options} options
 * @returns {{
 *   configuration?: Configuration,
 *   error?: string
 * }}
 */
export default function createConfiguration(options) {
  if (!options.baseUrl) {
    return { error: "No baseUrl found" };
  }

  /**
   * @type Configuration
   */
  const configuration = {};
  configuration.defaultRouteParams = options.defaultRouteParams;
  configuration.baseUrl = formatBaseUrl(options.baseUrl);
  configuration.create = options.create;
  configuration.read = options.read;
  if (options.schemas) {
    configuration.schemas = {};
    configuration.schemas.CreateBody = options.schemas.CreateBody;
    configuration.schemas.IdParam = options.schemas.IdParam;
  }

  return { configuration };
}

function formatBaseUrl(baseUrl) {
  if (baseUrl[0] !== "/") {
    baseUrl = "/" + baseUrl;
  }
  if (baseUrl[baseUrl.length - 1] === "/") {
    baseUrl = baseUrl.substring(0, baseUrl.length - 1);
  }

  return baseUrl;
}
