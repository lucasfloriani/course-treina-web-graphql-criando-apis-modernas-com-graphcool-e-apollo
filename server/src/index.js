const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const schema = require('./schema');
const connectMongo = require('./mongo-connector');
const { authenticate } = require('./authentication');
const buildDataloaders = require('./dataloaders');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const cors = require('cors');

const PORT = 3000;

const start = async () => {
  const mongo = await connectMongo();

  const buildOptions = async (req, res) => {
    const user = await authenticate(req, mongo.Users);
    return {
      context: {
        dataloaders: buildDataloaders(mongo),
        mongo,
        user
      },
      schema
    }
  }

  var app = express();
  var server = createServer(app);

  app.use('/graphql', cors(), bodyParser.json(), graphqlExpress(buildOptions));
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    passHeader: `'Authorization': 'bearer token-abc@def.com'`,
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
  }))

  server.listen(PORT, () => {
    SubscriptionServer.create(
      {execute, subscribe, schema},
      {server, path: '/subscriptions'}
    );
    console.log(`server running on ${PORT}`);
  });
}

start();