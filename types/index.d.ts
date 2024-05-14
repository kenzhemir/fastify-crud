import { FastifyInstance } from "fastify";

/**
 * Plugin to generate CRUD routes
 */
export default function createCrudRoutes(
  fastify: FastifyInstance,
  options: Options,
  done: () => void
): void;
export type Options<
  IdParam = any,
  TCreateBody = any,
  TResource = any,
  TUpdateBody = any,
> = {
  /**
   * - This url is going to be used to create the routes
   */
  baseUrl: string;
  /**
   * - Validation schemas
   */
  schemas?: {
    /**
     * Schema for ID parameter. Adding validation schema might change the argument type
     */
    IdParam?: any;
    /**
     * Schema for validating payload of the POST /{baseUrl} route
     */
    CreateBody?: any;
    /**
     * Schema for validating payload of the PATCH /{baseUrl}/:id route
     */
    UpdateBody?: any;
  };
  /**
   * - Template for creating route
   */
  defaultRouteParams?: any;
  /**
   * - This function will be used to create a resource for POST /{baseUrl} route
   */
  create?: (ctx: Context, resource: TCreateBody) => Promise<unknown>;
  /**
   * - This function will be used to read a resource for GET /{baseUrl}/:id route
   */
  read?: (ctx: Context, resourceId: string | IdParam) => Promise<TResource>;
  /**
   * - This function will be used to read a resource for PATCH /{baseUrl}/:id route
   */
  update?: (
    ctx: Context,
    resourceId: string | IdParam,
    resource: TUpdateBody
  ) => Promise<TResource>;
  /**
   * - This function will be used to delete a resource for DELETE /{baseUrl}/:id route
   */
  delete?: (ctx: Context, resourceId: string | IdParam) => Promise<number>;
};
