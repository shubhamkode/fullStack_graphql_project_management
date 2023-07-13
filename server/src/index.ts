import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "http";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8000;

const schema = createSchema({ typeDefs: `type Query {
    hello: String!
}`, resolvers: {} });

const main = () => {
  const yoga = createYoga({ landingPage: false, schema });

  const server = createServer(yoga);

  server.listen({ port: PORT }, () => {
    console.info(`Server is running at 'http://localhost:${PORT}'`);
  });
};
main();
