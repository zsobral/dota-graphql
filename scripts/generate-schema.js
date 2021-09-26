const fs = require('fs')
const path = require('path')
const { printSchema } = require('graphql')
const { schema } = require('../src/graphql')

const filePath = path.resolve(__dirname, '../schema.graphql')

fs.writeFileSync(filePath, printSchema(schema))
