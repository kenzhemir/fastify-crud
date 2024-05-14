import Fastify from 'fastify'
import t from 'tap'
import crudPlugin from '../src/index.js'

// fixtures
const bookPayload = {
  title: 'Harry Potter'
}
const bookFromDatabase = {
  id: 123,
  title: 'Harry Potter'
}
const BookSchema = {
  $id: 'BookSchema',
  type: 'object',
  properties: {
    title: {
      type: 'string'
    }
  },
  required: ['title']
}

t.test(
  'Create route is not registered without `create` function',
  async (t) => {
    const fastify = Fastify()

    fastify.register(crudPlugin, {
      baseUrl: '/api/v1/books'
      // create function is not initialized
    })

    const fastifyResponse = await fastify.inject({
      method: 'POST',
      url: '/api/v1/books'
    })

    t.equal(fastifyResponse.statusCode, 404)

    const responsePayload = fastifyResponse.json()
    t.equal(responsePayload.message, 'Route POST:/api/v1/books not found')
  }
)

t.test('Create route is registered with `create` function', async (t) => {
  const fastify = Fastify()

  fastify.register(crudPlugin, {
    baseUrl: '/api/v1/books',
    create: function createMock (_, resource) {
      t.strictSame(resource, bookPayload)
      return bookFromDatabase
    }
  })

  const fastifyResponse = await fastify.inject({
    method: 'POST',
    url: '/api/v1/books',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(bookPayload)
  })

  t.equal(fastifyResponse.statusCode, 201)
  t.equal(
    fastifyResponse.headers['content-type'],
    'application/json; charset=utf-8'
  )

  const responsePayload = fastifyResponse.json()
  t.strictSame(responsePayload, bookFromDatabase)
})

t.test('Perform schema validation', async (t) => {
  const fastify = Fastify()

  fastify.register(crudPlugin, {
    baseUrl: '/api/v1/books',
    create: function createMock (_, resource) {
      t.strictSame(resource, bookPayload)
      return bookFromDatabase
    },
    schemas: {
      CreateBody: BookSchema
    }
  })

  const fastifySuccessResponse = await fastify.inject({
    method: 'POST',
    url: '/api/v1/books',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(bookPayload)
  })

  t.equal(fastifySuccessResponse.statusCode, 201)
  t.equal(
    fastifySuccessResponse.headers['content-type'],
    'application/json; charset=utf-8'
  )

  const successPayload = fastifySuccessResponse.json()
  t.strictSame(successPayload, bookFromDatabase)

  const fastifyFailuerResponse = await fastify.inject({
    method: 'POST',
    url: '/api/v1/books',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ not_title: 'Harry Potter' })
  })

  t.equal(fastifyFailuerResponse.statusCode, 400)
  const failurePayload = fastifyFailuerResponse.json()
  t.strictSame(failurePayload, {
    statusCode: 400,
    code: 'FST_ERR_VALIDATION',
    error: 'Bad Request',
    message: "body must have required property 'title'"
  })
})
