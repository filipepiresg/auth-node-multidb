const NotImplementedException = require("./NotImplementedException")

class CRUD {
  createUser(user) {
    throw new NotImplementedException()
  }
  readUser(query) {
    throw new NotImplementedException()
  }
  updateUser(id, user) {
    throw new NotImplementedException()
  }
  deleteUser(id) {
    throw new NotImplementedException()
  }
}

module.exports = CRUD
