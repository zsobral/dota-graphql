const { ApolloServer } = require('apollo-server')
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require('apollo-server-core')
const { HeroesDataSource } = require('./data-source/heroes-data-source')
const { schema } = require('./graphql')

const server = new ApolloServer({
  schema: schema,
  introspection: true,
  dataSources: () => ({
    heroes: new HeroesDataSource(),
  }),
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      settings: { 'schema.polling.enable': false },
    }),
  ],
})

module.exports = { server }
