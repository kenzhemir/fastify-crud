import Fastify from "fastify";
import t from "tap";
import crudPlugin from "../src/index.js";

t.test(
  "Plugin should fail to initialize if `baseUrl` is not provided",
  async (t) => {
    const fastify = Fastify();

    const error = await t.rejects(fastify.register(crudPlugin, {}).ready());
    t.equal(error, "No baseUrl found");
  }
);

t.test("Plugin should shape baseUrl into route format '/route'", async (t) => {
  const fastify = Fastify();

  await fastify
    .register(crudPlugin, {
      baseUrl: "api/",
      create: (resource) => {
        return resource;
      },
    })
    .after();

  t.equal(
    fastify.hasRoute({
      method: "POST",
      url: "/api",
    }),
    true
  );
});
