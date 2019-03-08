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
        type: DataTypes.VIRTUAL,
        required: true,
        validate: { min: 8, isAlphanumeric: true }
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false
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
        beforeValidate: async user => {
          if (user.password) {
            user.password_hash = await bcrypt.hash(user.password, 8)
          }
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
