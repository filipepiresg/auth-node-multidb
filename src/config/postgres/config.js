require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
})

module.exports = {
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT || "postgres",
  storage: "./__tests__/database.sqlite",
  operatorsAliases: false,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
}
