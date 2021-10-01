const { GraphQLEnumType } = require('graphql')

var attackTypeType = new GraphQLEnumType({
  name: 'AttackType',
  values: {
    MELEE: { value: 1 },
    RANGED: { value: 2 },
  },
})

module.exports = { attackTypeType }
