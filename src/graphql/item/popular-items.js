const { GraphQLObjectType, GraphQLNonNull, GraphQLList } = require('graphql')
const { itemType } = require('./item')

const popularItemsType = new GraphQLObjectType({
  name: 'PopularItems',
  fields: {
    startGame: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(itemType))),
      resolve: (source, args, context, info) => {
        return context.dataSources.items.findByIds(source.startGame)
      },
    },
    earlyGame: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(itemType))),
      resolve: (source, args, context, info) => {
        return context.dataSources.items.findByIds(source.earlyGame)
      },
    },
    midGame: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(itemType))),
      resolve: (source, args, context, info) => {
        return context.dataSources.items.findByIds(source.midGame)
      },
    },
    lateGame: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(itemType))),
      resolve: (source, args, context, info) => {
        return context.dataSources.items.findByIds(source.lateGame)
      },
    },
  },
})

module.exports = { popularItemsType }
