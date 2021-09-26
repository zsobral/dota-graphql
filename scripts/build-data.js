const fs = require('fs')
const path = require('path')
const axios = require('axios')
const ora = require('ora')

const filePath = path.resolve(__dirname, '../data/heroes.json')

const dotaClient = axios.create({
  baseURL: 'https://www.dota2.com/datafeed/',
  params: {
    language: 'english',
  },
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

function parseHeroDetailsAttackType(hero) {
  const attackTypesName = {
    1: 'Melee',
    2: 'Ranged',
  }

  const id = hero.attack_capability
  const name = attackTypesName[id]

  return {
    attackType: {
      id,
      name,
      image: `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/${name.toLowerCase()}.svg`,
    },
  }
}

function parseHeroDetailsPrimaryAttribute(hero) {
  const primaryAttributesName = {
    0: 'Strength',
    1: 'Agility',
    2: 'Intelligence',
  }

  const id = hero.primary_attr
  const name = primaryAttributesName[id]

  return {
    primaryAttribute: {
      id,
      name,
      image: `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero_${name.toLowerCase()}.png`,
    },
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

async function run() {
  const spinner = ora('Fetching heroes list').start()
  const output = []
  const heroes = await getHeroes()
  spinner.succeed(`Fetched ${heroes.length} heroes`)

  for (const hero of heroes) {
    spinner.start(`Fetching ${hero.name_loc} details`)
    const heroDetails = await getHeroDetails(hero.id)
    const parsedHeroDetails = {
      ...parseHeroDetailsSummary(heroDetails),
      ...parseHeroDetailsAttackType(heroDetails),
      ...parseHeroDetailsPrimaryAttribute(heroDetails),
      ...parseHeroDetailsAbilities(heroDetails),
    }
    output.push(parsedHeroDetails)
    spinner.succeed(`Fetched ${hero.name_loc} details`)
  }

  spinner.start(`Writing file to ${filePath}`)
  fs.writeFileSync(filePath, JSON.stringify(output, null, 2))
  spinner.succeed('Success')
}

run().catch(console.log)
