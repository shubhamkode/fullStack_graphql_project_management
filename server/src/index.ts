import { createYoga } from "graphql-yoga";
import { createServer } from "http";
import dotenv from "dotenv";
dotenv.config();

import { schema } from "./schema";

const PORT = process.env.PORT || 8000;

const main = () => {
  const yoga = createYoga({ schema });

  const server = createServer(yoga);

  server.listen({ port: PORT }, () => {
    console.info(`Server is running at 'http://localhost:${PORT}'`);
  });
};
main();
