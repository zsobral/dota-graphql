const getPort = require('get-port')
const axios = require('axios')
const { gql } = require('apollo-server')
const { server } = require('../src/server')
const { print } = require('graphql')

let serverInfo
let gqlClient

beforeAll(async () => {
  const port = await getPort()
  serverInfo = await server.listen({ port })
  gqlClient = axios.create({ baseURL: serverInfo.url })
})

afterAll(async () => {
  await new Promise((resolve) => serverInfo.server.close(resolve))
})

const query = gql`
  query Heroes {
    heroes {
      id
      name
      description
      lore
      bio
      image
      video
      thumbnail
      attackType
      primaryAttribute
      abilities {
        id
        name
        image
      }
    }
  }
`

test('fetch all heroes without errors', async () => {
  const result = await gqlClient({
    method: 'POST',
    data: { query: print(query) },
  })

  expect(result.data.errors).toBeUndefined()
  expect(result.data.data.heroes).toHaveLength(121)
})
