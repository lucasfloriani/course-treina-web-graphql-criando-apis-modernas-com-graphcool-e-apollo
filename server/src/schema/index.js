const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
type Post{
  id: ID!
  titulo: String!
}

type Query{
  allPosts: [Post!]!
}
`;

module.exports = makeExecutableSchema({typeDefs, resolvers});