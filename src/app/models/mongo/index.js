const path = require("path")
const fs = require("fs")
const mongoose = require("mongoose")
const config = require("../../../config/mongo/config")
const basename = path.basename(__filename)
const db = {}

mongoose.connection.on("connected", () => console.log(`Connected to DB`))

mongoose.connection.on("reconnected", () => {
  console.log("Connection Reestablished")
})

mongoose.connection.on("disconnected", () => {
  console.log("Connection Disconnected")
})

mongoose.connection.on("close", () => {
  console.log("Connection Closed")
})

mongoose.connection.on("error", error => {
  console.log("ERROR: " + error)
})

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    )
  })
  .forEach(file => {
    const model_path = path.join(__dirname, file)
    const model = require(model_path)
    const model_name = file.slice(0, file.length - 3)
    db[model_name] = model
  })

const run = async () => {
  await mongoose.connect(
    `mongodb://${config.username}:${config.password}@${config.host}:27017/${
      config.database
    }`,
    {
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 5,
      useNewUrlParser: true,
      useCreateIndex: true
    }
  )
}

run().catch(error => console.error(error))

db.mongoose = mongoose

module.exports = db
