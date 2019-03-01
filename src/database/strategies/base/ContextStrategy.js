class ContextStrategy {
  constructor(strategy) {
    this._database = strategy
  }
  isConnected() {
    return this._database.isConnected()
  }
  connect() {
    return this._database.connect()
  }
  disconnect() {
    return this._database.disconnect()
  }
  /* createUser(user) {
    return this._database.createUser(user)
  }
  readUser(query) {
    return this._database.readUser(query)
  }
  update(id, user) {
    return this._database.updateUser(id, user)
  }
  delete(id) {
    return this._database.deleteUser(id)
  } */
}

module.exports = ContextStrategy
