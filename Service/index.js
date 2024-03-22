import express from 'express'
import { ApolloServer, AuthenticationError } from 'apollo-server-express'
import { typeDefs } from './schema.js'
import resolvers from './resolvers.js'  


const app = express();

// Define middleware to authenticate requests
const authenticateWithApiKey = (req, res, next) => {
    const clientApiKey = req.headers['x-api-key']; // Extract API key from header

    // Compare with the stored API key
    if (clientApiKey !== process.env.API_KEY) {
        throw new AuthenticationError('Invalid API key');
    }

    next(); // Continue with the request
};

//app.use(authenticateWithApiKey); // Apply the middleware to all requests

// server setup
const server = new ApolloServer({
    typeDefs,
    resolvers
})

async function startApolloServer() {
    await server.start();
    server.applyMiddleware({ app });
}

startApolloServer().then(() => {
    app.listen({ port: 4000 }, () =>
        console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
    );
});