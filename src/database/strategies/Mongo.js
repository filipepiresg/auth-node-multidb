const Crud = require("./interfaces/CRUD")
const { mongoose, ...models } = require("../../app/models/mongo")

class MongoStrategy extends Crud {
  constructor() {
    super()
    this._db = {}
    this.connect()
  }
  async isConnected() {
    try {
      const state = await this._db.mongoose.connection.readyState
      return state === 1
    } catch (error) {
      return false
    }
  }
  _defineModels() {
    Promise.all(
      Object.keys(models).forEach(async model => {
        this._db[model] = await models[model]
      })
    )
  }
  async connect() {
    const _models = Object.keys(this._db)
    if (_models.length === 0) {
      this._db.mongoose = mongoose
      await this._db.mongoose.run()
      await this._defineModels()
    }
  }
  disconnect() {
    if (Object.keys(this._db).length !== 0) {
      this._db = {}
    }
  }
  async create(item) {
    return await this._db.User.create(item)
  }
  async read(query = {}) {
    return await this._db.User.find({
      ...query
    })
  }
  async update(id, item) {
    let user = await this._db.User.findOne({ _id: id })
    if (user) {
      Object.keys(item).forEach(key => {
        user[key] = item[key]
      })
      user = await user.save()
      user.password = undefined
    }
    return user
  }
  async delete(id) {
    const deleted = await this._db.User.findOneAndDelete({ _id: id })
    if (deleted) {
      deleted.password = undefined
    }
    return deleted
  }
}

module.exports = MongoStrategy
