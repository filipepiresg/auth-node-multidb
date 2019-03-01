const Sequelize = require("sequelize")

const Crud = require("./interfaces/CRUD")
const { getModelsPostgres } = require("../../utils")
const config = require("../../config/postgres/config")

class PostgresStrategy extends Crud {
  constructor() {
    super()
    this._driver = {}
    this._db = {}
    this.connect()
  }
  async isConnected() {
    try {
      await this._driver.authenticate()
      return true
    } catch (err) {
      // console.error(err)
      return false
    }
  }
  async _defineModels() {
    const models = await getModelsPostgres()
    models.forEach(async model => {
      this._db[model.toLowerCase()] = this._driver.import(
        `../../app/models/postgres/${model}.js`
      )

      await this._db[model.toLowerCase()].sync()
    })
  }
  async connect() {
    if (Object.keys(this._driver).length === 0) {
      this._driver = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
      )
      await this._defineModels()
    }
  }
  async disconnect() {
    if (Object.keys(this._driver).length !== 0) {
      this._driver = {}
      this._db = {}
    }
  }
}

module.exports = PostgresStrategy
