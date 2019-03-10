const faker = require("faker")
const { factory } = require("factory-girl")
const { User: UserMongo } = require("../../src/app/models/mongo")
const { User: UserPostgres } = require("../../src/app/models/postgres")

factory.define("UserMongo", UserMongo, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})
factory.define("UserPostgres", UserPostgres, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

module.exports = factory
