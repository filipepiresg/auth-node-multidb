const Crud = require("./interfaces/CRUD")
const { sequelize, Sequelize, ...models } = require("../../app/models/postgres")

class PostgresStrategy extends Crud {
  constructor() {
    super()
    this._driver = {}
    this._db = {}
    this.connect()
  }
  async isConnected() {
    try {
      await this._driver.sequelize.authenticate()
      return true
    } catch (err) {
      return false
    }
  }
  _defineModels() {
    Promise.all(
      Object.keys(models).map(async model => {
        this._db[model] = models[model]
        await this._db[model].sync()
      })
    )
  }
  async connect() {
    const drivers = Object.keys(this._driver).length
    if (drivers === 0) {
      this._driver.sequelize = sequelize
      this._driver.Sequelize = Sequelize
      await this._defineModels()
    }
  }
  async disconnect() {
    const drivers = Object.keys(this._driver).length
    if (drivers !== 0) {
      this._driver = {}
      this._db = {}
    }
  }
  async create(item) {
    const {
      dataValues: { id, name, email, updated_at, created_at, password_hash }
    } = await this._db.User.create(item)
    return { id, name, email, password_hash, created_at, updated_at }
  }
  async read(query) {
    return this._db.User.findAll({
      where: { ...query },
      raw: true,
      attributes: [
        "id",
        "name",
        "email",
        "password_hash",
        "created_at",
        "updated_at"
      ]
    })
  }
  async update(id, item) {
    // const result = await this._db.User.update(
    return this._db.User.update(
      { ...item },
      {
        where: { id },
        fields: Object.keys(item)
        // returning: true,
        // plain: true,
        // raw: true
      }
    )
    // return [user]
  }
  async delete(id) {
    return this._db.User.destroy({ where: { id } })
  }
}

module.exports = PostgresStrategy
