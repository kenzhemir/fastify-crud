import Fastify from "fastify";
import t from "tap";
import crudPlugin from "../src/index.js";

// fixtures
const bookId = 123;
const bookPayload = {
  title: "Harry Potter",
};
const bookFromDatabase = {
  id: bookId,
  title: "Harry Potter",
};
const IdParamSchema = {
  $id: "IdParamSchema",
  type: "number",
};

const BookSchema = {
  $id: "BookSchema",
  type: "object",
  properties: {
    title: {
      type: "string",
    },
  },
  required: ["title"],
};

t.test(
  "Update route is not registered without `update` function",
  async (t) => {
    const fastify = Fastify();

    fastify.register(crudPlugin, {
      baseUrl: "/api/v1/books",
      // update function is not initialized
    });

    const fastifyResponse = await fastify.inject({
      method: "PATCH",
      url: `/api/v1/books/${bookId}`,
    });

    t.equal(fastifyResponse.statusCode, 404);

    const responsePayload = fastifyResponse.json();
    t.equal(
      responsePayload.message,
      `Route PATCH:/api/v1/books/${bookId} not found`
    );
  }
);

t.test("Update route is registered with `update` function", async (t) => {
  const fastify = Fastify();

  fastify.register(crudPlugin, {
    baseUrl: "/api/v1/books",
    update: function updateMock(resourceId, resource) {
      t.equal(resourceId, String(bookId));
      t.strictSame(resource, bookPayload);
      return bookFromDatabase;
    },
  });

  const fastifyResponse = await fastify.inject({
    method: "PATCH",
    url: `/api/v1/books/${bookId}`,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(bookPayload),
  });

  t.equal(fastifyResponse.statusCode, 200);
  t.equal(
    fastifyResponse.headers["content-type"],
    "application/json; charset=utf-8"
  );

  const responsePayload = fastifyResponse.json();
  t.strictSame(responsePayload, bookFromDatabase);
});

t.test("Perform schema validation", async (t) => {
  const fastify = Fastify();
  fastify.register(crudPlugin, {
    baseUrl: "/api/v1/books",
    update: function updateMock(resourceId, resource) {
      t.equal(resourceId, bookId);
      t.strictSame(resource, bookPayload);
      return bookFromDatabase;
    },
    schemas: {
      UpdateBody: BookSchema,
      IdParam: IdParamSchema,
    },
  });

  const fastifySuccessResponse = await fastify.inject({
    method: "PATCH",
    url: `/api/v1/books/${bookId}`,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(bookPayload),
  });

  t.equal(fastifySuccessResponse.statusCode, 200);
  t.equal(
    fastifySuccessResponse.headers["content-type"],
    "application/json; charset=utf-8"
  );

  const successPayload = fastifySuccessResponse.json();
  t.strictSame(successPayload, bookFromDatabase);

  const fastifyBodyFailureResponse = await fastify.inject({
    method: "PATCH",
    url: `/api/v1/books/${bookId}`,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ not_title: "Harry Potter" }),
  });

  t.equal(fastifyBodyFailureResponse.statusCode, 400);
  const bodyFailurePayload = fastifyBodyFailureResponse.json();
  t.strictSame(bodyFailurePayload, {
    statusCode: 400,
    code: "FST_ERR_VALIDATION",
    error: "Bad Request",
    message: "body must have required property 'title'",
  });

  const fastifyIdFailureResponse = await fastify.inject({
    method: "PATCH",
    url: `/api/v1/books/not-a-number`,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(bookPayload),
  });

  t.equal(fastifyIdFailureResponse.statusCode, 400);
  const idFailurePayload = fastifyIdFailureResponse.json();
  t.strictSame(idFailurePayload, {
    statusCode: 400,
    code: "FST_ERR_VALIDATION",
    error: "Bad Request",
    message: "params/id must be number",
  });
});
