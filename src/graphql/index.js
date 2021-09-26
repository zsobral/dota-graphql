const { GraphQLObjectType, GraphQLSchema } = require('graphql')
const { heroesQuery, heroQuery } = require('./hero/hero')

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...heroesQuery,
    ...heroQuery,
  },
})

const schema = new GraphQLSchema({ query: queryType })

module.exports = { schema }
