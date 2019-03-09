const Context = require("../../src/database/strategies/base/ContextStrategy")
const PostgreStrategy = require("../../src/database/strategies/Postgre")
const truncate = require("../utils/postgres/truncate")
const factories = require("../utils/postgres/factories")

const db = new Context(new PostgreStrategy())

// const USER_CREATE = {
//   name: "Filipe",
//   email: "filipepiresg@gmail.com",
//   password: "123456"
// }
// const USER_UPDATE = {
//   name: "Filipe Pires"
// }
describe("Test suite for Postegres Strategy", () => {
  it("should test the auto connection to db", async () => {
    const connection = await db.isConnected()

    expect(connection).toBe(true)
  })
  it("should test the function's connect to db", async () => {
    db.disconnect()
    let connection = await db.isConnected()
    expect(connection).toBe(false)

    db.connect()
    connection = await db.isConnected()
    expect(connection).toBe(true)
  })
})

describe("Test suite for CRUD on Postegres Strategy", () => {
  beforeEach(async () => {
    await truncate()
  })
  it("should test the created user on db", async () => {
    const { dataValues } = await factories.create("User", {
      name: "Filipe",
      email: "filipepiresg@gmail.com"
    })

    delete dataValues.id
    delete dataValues.password
    delete dataValues.password_hash
    delete dataValues.created_at
    delete dataValues.updated_at

    expect(dataValues).toEqual({
      name: "Filipe",
      email: "filipepiresg@gmail.com"
    })
  })
  it("should test the read user on db", async () => {
    const { dataValues } = await factories.create("User")

    delete dataValues.created_at
    delete dataValues.updated_at
    delete dataValues.password

    const [user] = await db.read({ id: dataValues.id })

    delete user.created_at
    delete user.updated_at

    expect(user).toEqual(dataValues)
  })
  it("should test the update user on db", async () => {
    const { dataValues } = await factories.create("User")

    delete dataValues.created_at
    delete dataValues.updated_at
    delete dataValues.password

    const [code_update] = await db.update(dataValues.id, {
      name: "Filipe Pires"
    })
    expect(code_update).toBe(1)

    const [expectedUser] = await db.read({ id: dataValues.id })
    delete expectedUser.created_at
    delete expectedUser.updated_at

    expect(expectedUser).toEqual({ ...dataValues, name: "Filipe Pires" })
  })
  it("should test the delete user on db", async () => {
    const {
      dataValues: { id }
    } = await factories.create("User")

    const code_delete = await db.delete(id)

    expect(code_delete).toBe(1)

    const users = await db.read({ id })

    expect(users).toEqual([])
  })
})
