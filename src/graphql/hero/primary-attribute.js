const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
} = require('graphql')

const primaryAttributeType = new GraphQLObjectType({
  name: 'PrimaryAttribute',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    image: { type: new GraphQLNonNull(GraphQLString) },
  },
})

module.exports = { primaryAttributeType }
