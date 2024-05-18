# fastify-crud

[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fkenzhemir%2Ffastify-crud%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/kenzhemir/fastify-crud/main)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Fastify Plugin to create CRUD routes. This plugin is good for fast prototyping.

## Installation

```shell
npm i @kenzhemir/fastify-crud
```

## Usage

```javascript
import Fastify from 'fastify'
import crudPlugin from '@kenzhemir/fastify-crud'

const fastify = Fastify()

fastify.register(crudPlugin, {
  baseUrl: '/api/v1/books',
  create: async (resource) => {/* Insert resource into DB */},
  read: async (resourceId) => {/* Select resource from DB */},
  update: async (resourceId, resource) => {/* Update resource in DB */},
  delete: async (resourceId) => {/* Delete resource from */},
  schemas: {
    IdParam: {/*...*/},
    CreateBody: {/*...*/},
    UpdateBody: {/*...*/}
  }
})

fastify.listen(3000)
```

## Options

- `baseUrl` **(required)**: This URL is used to create the routes.
- `create`: This function is used to create a resource for the POST {baseUrl} route.
- `read`: This function is used to read a resource for the GET {baseUrl}/:id route.
- `update`: This function is used to update a resource for the PUT {baseUrl}/:id route.
- `delete`: This function is used to delete a resource for the DELETE {baseUrl}/:id route.
- `schemas`: Optional validation schemas
  - `IdParam`: Schema for validating :id parameter. Adding validation schema can impact the id argument.
  - `CreateBody`: Schema for validating resource for `Create`.
  - `UpdateBody`: Schema for validating resource for `Update`.
- `defaultRouteParams`: Object that will be used as a base for all the Route objects. This is an escape hatch in case you want to minimally configure the Routes' behaviour
