const Context = require("../../src/database/strategies/base/ContextStrategy")
const MongoStrategy = require("../../src/database/strategies/Mongo")
const truncate = require("../utils/postgres/truncate")

const db = new Context(new MongoStrategy())

const USER_CREATE = {
  name: "Filipe",
  email: "filipepiresg@gmail.com",
  password: "123456"
}
const USER_UPDATE = {
  name: "Filipe Pires"
}
describe.only("Test suite for Mongo Strategy", () => {
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

describe("Test suite for CRUD on Mongo Strategy", () => {
  beforeEach(async () => {
    await truncate()
  })
  it("should test the created user on db", async () => {
    const user = await db.create(USER_CREATE)

    delete user.id
    delete user.password_hash
    delete user.created_at
    delete user.updated_at

    expect(user).toEqual(USER_CREATE)
  })
  it("should test the read user on db", async () => {
    const expectUser = await db.create(USER_CREATE)

    delete expectUser.password_hash
    delete expectUser.created_at
    delete expectUser.updated_at
    delete expectUser.password

    const [user] = await db.read({ name: "Filipe" })

    delete user.created_at
    delete user.updated_at

    expect(user).toEqual(expectUser)
  })
  it("should test the update user on db", async () => {
    const user = await db.create(USER_CREATE)
    delete user.created_at
    delete user.updated_at
    delete user.password
    delete user.password_hash

    const [result] = await db.update(user.id, USER_UPDATE)
    expect(result).toBe(1)

    const [expectedUser] = await db.read({ id: user.id })
    delete expectedUser.created_at
    delete expectedUser.updated_at

    expect(expectedUser).toEqual({ ...user, ...USER_UPDATE })
  })
  it("should test the delete user on db", async () => {
    const { id } = await db.create(USER_CREATE)

    const code_delete = await db.delete(id)

    expect(code_delete).toBe(1)

    const result = await db.read({ id })

    expect(result).toEqual([])
  })
})
