import Fastify from 'fastify'
import t from 'tap'
import crudPlugin from '../src/index.js'

// fixtures
const bookId = 123
const IdParamSchema = {
  $id: 'IdParamSchema',
  type: 'number'
}

t.test(
  'Delete route is not registered without `delete` function',
  async (t) => {
    const fastify = Fastify()

    fastify.register(crudPlugin, {
      baseUrl: '/api/v1/books'
      // delete function is not initialized
    })

    const fastifyResponse = await fastify.inject({
      method: 'DELETE',
      url: `/api/v1/books/${bookId}`
    })

    t.equal(fastifyResponse.statusCode, 404)

    const responsePayload = fastifyResponse.json()
    t.equal(
      responsePayload.message,
      `Route DELETE:/api/v1/books/${bookId} not found`
    )
  }
)

t.test('Delete route is registered with `delete` function', async (t) => {
  const fastify = Fastify()

  fastify.register(crudPlugin, {
    baseUrl: '/api/v1/books',
    delete: function deleteMock (_, resourceId) {
      t.strictSame(resourceId, String(bookId))
    }
  })

  const fastifyResponse = await fastify.inject({
    method: 'DELETE',
    url: `/api/v1/books/${bookId}`
  })

  t.equal(fastifyResponse.statusCode, 204)
})

t.test('Delete route returns 204 if no ', async (t) => {
  const fastify = Fastify()

  fastify.register(crudPlugin, {
    baseUrl: '/api/v1/books',
    delete: function deleteMock (_, resourceId) {
      t.strictSame(resourceId, String(bookId))
      return 1
    }
  })

  const fastifyResponse = await fastify.inject({
    method: 'DELETE',
    url: `/api/v1/books/${bookId}`
  })

  t.equal(fastifyResponse.statusCode, 200)
})

t.test('Perform schema validation', async (t) => {
  const fastify = Fastify()

  fastify.register(crudPlugin, {
    baseUrl: '/api/v1/books',
    delete: function deleteMock (_, resourceId) {
      t.strictSame(resourceId, bookId)
      return 1
    },
    schemas: {
      IdParam: IdParamSchema
    }
  })

  const fastifySuccessResponse = await fastify.inject({
    method: 'DELETE',
    url: `/api/v1/books/${bookId}`
  })
  t.equal(fastifySuccessResponse.statusCode, 200)

  const fastifyFailuerResponse = await fastify.inject({
    method: 'DELETE',
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
