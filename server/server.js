const express = require('express');
const path = require('path');
// import ApolloServer
const { ApolloServer } = require('@apollo/server');
// import expressMiddleware 
const { expressMiddleware } = require('@apollo/server/express4');
// import typeDefs and resolvers from ./schemas
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

// import authMiddleware
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;
// initialize server as instance of ApolloServer including typeDefs, resolvers, and formatError 
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError(error) {
    return error;
  }
});
// function to start ApolloServer, implement middleware, and listen for client side requests as well as provide instance to graphQL
const startApolloServer = async () => {
  await server.start();
  
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));
  
  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();
