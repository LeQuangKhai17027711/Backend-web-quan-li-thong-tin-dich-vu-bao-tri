import express from "express";

import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from "./schema/schema.js"


import 'dotenv/config.js'
let PORT = process.env.PORT || 8751;

/* create an express app and use JSON */
let app = new express();
const httpServer = http.createServer(app)

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})
await server.start()



app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    expressMiddleware(server, {
        context: async ({ req }) => ({ token: req.headers.token }),
    }),
);

await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
