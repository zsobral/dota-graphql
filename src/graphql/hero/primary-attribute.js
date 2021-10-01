const { GraphQLEnumType } = require('graphql')

var primaryAttributeType = new GraphQLEnumType({
  name: 'PrimaryAttribute',
  values: {
    STRENGTH: { value: 0 },
    AGILITY: { value: 1 },
    INTELLIGENCE: { value: 2 },
  },
})

module.exports = { primaryAttributeType }
