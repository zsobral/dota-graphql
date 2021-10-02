const fs = require('fs')
const path = require('path')
const axios = require('axios')
const ora = require('ora')
const prettier = require('prettier')

const dotaClient = axios.create({
  baseURL: 'https://www.dota2.com/datafeed/',
  params: {
    language: 'english',
  },
})

const openDotaClient = axios.create({
  baseURL: 'https://api.opendota.com/api/',
})

async function getHeroes() {
  const { data } = await dotaClient.get('/herolist')
  return data.result.data.heroes
}

async function getHeroDetails(id) {
  const params = { hero_id: id }
  const { data } = await dotaClient.get('/herodata', { params })
  return data.result.data.heroes[0]
}

async function getHeroItemPopularity(heroId) {
  const { data } = await openDotaClient.get(`/heroes/${heroId}/itemPopularity`)

  return {
    startGame: Object.keys(data.start_game_items).map(Number),
    earlyGame: Object.keys(data.early_game_items).map(Number),
    midGame: Object.keys(data.mid_game_items).map(Number),
    lateGame: Object.keys(data.late_game_items).map(Number),
  }
}

function parseHeroDetailsSummary(hero) {
  const npcId = hero.name.replace('npc_dota_hero_', '')

  return {
    id: hero.id,
    nameId: hero.name,
    name: hero.name_loc,
    bio: hero.bio_loc,
    lore: hero.hype_loc,
    description: hero.npe_desc_loc,
    attackType: hero.attack_capability,
    primaryAttribute: hero.primary_attr,
    image: `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${npcId}.png`,
    video: `https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${npcId}.webm`,
    thumbnail: `https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${npcId}.png`,
  }
}

function parseHeroDetailsAbilities(hero) {
  const parseHeroDetailsAbility = (ability) => {
    return {
      id: ability.id,
      nameId: ability.name,
      name: ability.name_loc,
      description: ability.desc_loc,
      lore: ability.lore_loc,
      image: `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability.name}.png`,
    }
  }

  return {
    abilities: hero.abilities.map(parseHeroDetailsAbility),
  }
}

async function buildHeroes() {
  const filePath = path.resolve(__dirname, '../data/heroes.json')
  const spinner = ora('Fetching heroes list').start()
  const heroesOutput = []
  const heroes = await getHeroes()
  spinner.succeed(`Fetched ${heroes.length} heroes`)

  for (const hero of heroes) {
    spinner.start(`Fetching ${hero.name_loc} details`)
    const heroDetails = await getHeroDetails(hero.id)
    const heroItemsPopularity = await getHeroItemPopularity(hero.id)
    const parsedHeroDetails = {
      ...parseHeroDetailsSummary(heroDetails),
      ...parseHeroDetailsAbilities(heroDetails),
      popularItems: heroItemsPopularity,
    }
    heroesOutput.push([hero.id, parsedHeroDetails])
    spinner.succeed(`Fetched ${hero.name_loc} details`)
  }

  const heroesById = Object.fromEntries(heroesOutput)
  const output = prettier.format(JSON.stringify(heroesById), { parser: 'json' })
  fs.writeFileSync(filePath, output)
}

async function buildItems() {
  const filePath = path.resolve(__dirname, '../data/items.json')
  const spinner = ora('Fetching items').start()
  const { data: items } = await openDotaClient.get('/constants/items')
  spinner.succeed('Items fetched')
  const itemsById = Object.fromEntries(
    Object.values(items).map((item) => [item.id, item])
  )
  const output = prettier.format(JSON.stringify(itemsById), { parser: 'json' })
  fs.writeFileSync(filePath, output)
}

async function run() {
  await buildHeroes()
  await buildItems()
}

run().catch(console.log)
