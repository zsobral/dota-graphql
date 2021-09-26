const { DataSource } = require('apollo-datasource')
const heroes = require('../../data/heroes.json')

class HeroesDataSource extends DataSource {
  find() {
    return heroes
  }

  findById(id) {
    return heroes.find((hero) => hero.id === id)
  }
}

module.exports = { HeroesDataSource }
