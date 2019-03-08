const Context = require("../../src/database/strategies/base/ContextStrategy")
const PostegresStrategy = require("../../src/database/strategies/postgres")
const truncate = require("../util/truncate_postgres")

const Postgres = new Context(new PostegresStrategy())

const USER_CREATE = {
  name: "Filipe",
  email: "filipepiresg@gmail.com",
  password: "123456"
}
const USER_UPDATE = {
  name: "Filipe Pires"
}
describe("Test suite for Postegres Strategy", () => {
  it("should test the auto connection to db", async () => {
    const connection = await Postgres.isConnected()

    expect(connection).toBe(true)
  })
  it("should test the function's connect to db", async () => {
    Postgres.disconnect()
    let connection = await Postgres.isConnected()
    expect(connection).toBe(false)

    Postgres.connect()
    connection = await Postgres.isConnected()
    expect(connection).toBe(true)
  })
})

describe("Test suite for CRUD on Postegres Strategy", () => {
  beforeEach(async () => {
    await truncate()
  })
  it("should test the created user on db", async () => {
    const user = await Postgres.create(USER_CREATE)

    delete user.id
    delete user.password_hash
    delete user.created_at
    delete user.updated_at

    expect(user).toEqual(USER_CREATE)
  })
  it("should test the read user on db", async () => {
    const expectUser = await Postgres.create(USER_CREATE)

    delete expectUser.password_hash
    delete expectUser.created_at
    delete expectUser.updated_at
    delete expectUser.password

    const [user] = await Postgres.read({ name: "Filipe" })

    delete user.created_at
    delete user.updated_at

    expect(user).toEqual(expectUser)
  })
  it.only("should test the update user on db", async () => {
    const user = await Postgres.create(USER_CREATE)
    delete user.created_at
    delete user.updated_at
    delete user.password
    delete user.password_hash

    const [result] = await Postgres.update(user.id, USER_UPDATE)
    expect(result).toBe(1)

    const [expectedUser] = await Postgres.read({ id: user.id })
    delete expectedUser.created_at
    delete expectedUser.updated_at

    expect(expectedUser).toEqual({ ...user, ...USER_UPDATE })
  })
  it("should test the delete user on db", async () => {
    const { id } = await Postgres.create(USER_CREATE)

    const code_delete = await Postgres.delete(id)

    expect(code_delete).toBe(1)

    const result = await Postgres.read({ id })

    expect(result).toEqual([])
  })
})
