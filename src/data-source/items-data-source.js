const { DataSource } = require('apollo-datasource')
const items = require('../../data/items.json')

class ItemsDataSource extends DataSource {
  findByIds(ids) {
    return ids.map((id) => items[id])
  }
}

module.exports = { ItemsDataSource }
