import Fastify from 'fastify'
import t from 'tap'
import crudPlugin from '../src/index.js'

// fixtures
const bookId = 123
const bookFromDatabase = {
  id: bookId,
  title: 'Harry Potter'
}
const IdParamSchema = {
  $id: 'IdParamSchema',
  type: 'number'
}

t.test('Read route is not registered without `read` function', async (t) => {
  const fastify = Fastify()

  fastify.register(crudPlugin, {
    baseUrl: '/api/v1/books'
    // read function is not initialized
  })

  const fastifyResponse = await fastify.inject({
    method: 'GET',
    url: `/api/v1/books/${bookId}`
  })

  t.equal(fastifyResponse.statusCode, 404)

  const responsePayload = fastifyResponse.json()
  t.equal(
    responsePayload.message,
    `Route GET:/api/v1/books/${bookId} not found`
  )
})

t.test('Read route is registered with `read` function', async (t) => {
  const fastify = Fastify()

  fastify.register(crudPlugin, {
    baseUrl: '/api/v1/books',
    read: function readMock (_, resourceId) {
      t.strictSame(resourceId, String(bookId))
      return bookFromDatabase
    }
  })

  const fastifyResponse = await fastify.inject({
    method: 'GET',
    url: `/api/v1/books/${bookId}`
  })

  t.equal(fastifyResponse.statusCode, 200)
  const responsePayload = fastifyResponse.json()
  t.strictSame(responsePayload, bookFromDatabase)
})

t.test('Perform schema validation', async (t) => {
  const fastify = Fastify()

  fastify.register(crudPlugin, {
    baseUrl: '/api/v1/books',
    read: function readMock (_, resourceId) {
      t.strictSame(resourceId, bookId)
      return bookFromDatabase
    },
    schemas: {
      IdParam: IdParamSchema
    }
  })

  const fastifySuccessResponse = await fastify.inject({
    method: 'GET',
    url: `/api/v1/books/${bookId}`
  })

  t.equal(fastifySuccessResponse.statusCode, 200)
  const responsePayload = fastifySuccessResponse.json()
  t.strictSame(responsePayload, bookFromDatabase)

  const fastifyFailuerResponse = await fastify.inject({
    method: 'GET',
    url: '/api/v1/books/string'
  })

  t.equal(fastifyFailuerResponse.statusCode, 400)
  const failurePayload = fastifyFailuerResponse.json()
  t.strictSame(failurePayload, {
    statusCode: 400,
    code: 'FST_ERR_VALIDATION',
    error: 'Bad Request',
    message: 'params/id must be number'
  })
})
