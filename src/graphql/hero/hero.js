const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLInputObjectType,
} = require('graphql')
const { popularItemsType } = require('../item/popular-items')
const { abilityType } = require('./ability')
const { attackTypeType } = require('./attack-type')
const { primaryAttributeType } = require('./primary-attribute')

const heroType = new GraphQLObjectType({
  name: 'Hero',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    lore: { type: new GraphQLNonNull(GraphQLString) },
    bio: { type: new GraphQLNonNull(GraphQLString) },
    image: { type: new GraphQLNonNull(GraphQLString) },
    video: { type: new GraphQLNonNull(GraphQLString) },
    thumbnail: { type: new GraphQLNonNull(GraphQLString) },
    attackType: { type: new GraphQLNonNull(attackTypeType) },
    primaryAttribute: { type: new GraphQLNonNull(primaryAttributeType) },
    popularItems: { type: new GraphQLNonNull(popularItemsType) },
    abilities: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(abilityType))
      ),
    },
  },
})

const heroesQuery = {
  heroes: {
    type: new GraphQLList(heroType),
    resolve: (source, args, context, info) => {
      return context.dataSources.heroes.find()
    },
  },
}

const heroInputType = new GraphQLInputObjectType({
  name: 'HeroInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
  },
})

const heroQuery = {
  hero: {
    type: heroType,
    args: {
      input: { type: new GraphQLNonNull(heroInputType) },
    },
    resolve: (source, args, context, info) => {
      return context.dataSources.heroes.findById(args.input.id)
    },
  },
}

module.exports = { heroType, heroesQuery, heroQuery }
