require("dotenv/config");
const fs = require("fs");
const Inert = require("@hapi/inert");
const { createServer } = require("./server/dist");

const STATIC_DIR = "./client/dist";

const startServer = async () => {
  const server = await createServer();

  await server.register(Inert);

  server.route({
    method: "GET",
    path: "/",
    handler: {
      file: `${STATIC_DIR}/index.html`
    }
  });

  server.route({
    method: "GET",
    path: "/{p*1}",
    handler: (req, h) => {
      const { p } = req.params;
      const filePath = `${STATIC_DIR}/${p}`;

      if (fs.existsSync(filePath)) {
        return h.file(filePath);
      }

      return h.file(`${STATIC_DIR}/index.html`);
    }
  });

  server.start();
};

startServer();
