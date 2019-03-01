const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        validate: { isAlpha: true }
      },
      email: {
        type: DataTypes.STRING,
        required: true,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.VIRTUAL
      },
      hashPassword: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
        validate: { min: 8, isAlphanumeric: true }
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      hooks: {
        beforeSave: async user => {
          user.hashPassword = await bcrypt.hash(user.password, 11)
        }
      },
      tableName: "TB_USERS"
    }
  )

  User.prototype.checkPassword = function(password) {
    return bcrypt.compare(password, this.password_hash)
  }

  User.prototype.generateToken = function() {
    return jwt.sign({ id: this.id }, process.env.APP_SECRETKEY)
  }

  return User
}
