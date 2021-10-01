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
  query Hero($input: HeroInput!) {
    hero(input: $input) {
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

test('fetch hero with id 1 without errors', async () => {
  const heroId = 1
  const variables = { input: { id: heroId } }

  const result = await gqlClient({
    method: 'POST',
    data: { query: print(query), variables },
  })

  expect(result.data.errors).toBeUndefined()
  expect(result.data.data.hero.id).toBe(heroId)
})

test('fetch a invalid id returns null', async () => {
  const heroId = 199
  const variables = { input: { id: heroId } }

  const result = await gqlClient({
    method: 'POST',
    data: { query: print(query), variables },
  })

  expect(result.data.errors).toBeUndefined()
  expect(result.data.data.hero).toBeNull()
})
