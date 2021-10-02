const { DataSource } = require('apollo-datasource')
const heroes = require('../../data/heroes.json')

class HeroesDataSource extends DataSource {
  find() {
    return Object.values(heroes)
  }

  findById(id) {
    return heroes[id]
  }
}

module.exports = { HeroesDataSource }
