const fs = require("fs")
const path = require("path")

module.exports = {
  getModelsPostgres: () => {
    const basename = path.resolve("src", "app", "models", "postgres")
    const models = fs
      .readdirSync(basename)
      .filter(
        file =>
          file.indexOf(".") !== 0 &&
          file.split(".")[0] !== "index" &&
          file !== basename &&
          file.slice(-3) === ".js"
      )
      .map(file => file.split(".")[0])
    return models
  }
}
