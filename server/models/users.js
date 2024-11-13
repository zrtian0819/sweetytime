import { DataTypes } from 'sequelize'
import { generateHash } from '#db-helpers/password-hash.js'

export default async function (sequelize) {
  return sequelize.define(
    'users',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      role: {
        type: DataTypes.STRING(225),
        allowNull: false,
        defaultValue: 'user'
      },
      name: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      account: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      sign_up_time: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      activation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      portrait_path: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      google_id: {
        type: DataTypes.STRING(225),
        allowNull: true,
        unique: true
      },
      google_email: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await generateHash(user.password)
          }
        },
        beforeUpdate: async (user) => {
          if (user.password) {
            user.password = await generateHash(user.password)
          }
        },
      },
      sequelize,
      tableName: 'users',
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'google_id_UNIQUE',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'google_id' }],
        },
      ],
    }
  )
}