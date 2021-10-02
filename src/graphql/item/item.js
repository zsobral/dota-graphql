const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} = require('graphql')

const itemType = new GraphQLObjectType({
  name: 'Item',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (source) => source.dname,
    },
    lore: { type: new GraphQLNonNull(GraphQLString) },
    image: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (source) => source.img,
    },
  },
})

module.exports = { itemType }
