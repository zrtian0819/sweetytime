import { DataTypes } from 'sequelize'
// 加密密碼字串用
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
        allowNull: true,
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
        allowNull: true,
      },
      portrait_path: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
    },
    {
      hooks: {
        // 建立時產生密碼加密字串用
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await generateHash(user.password)
          }
        },
        // 更新時產生密碼加密字串用
        beforeUpdate: async (user) => {
          if (user.password) {
            user.password = await generateHash(user.password)
          }
        },
      },
      sequelize,
      tableName: 'users',
      timestamps: false,
      charset: 'utf8mb4', // 全域性設定 charset
      collate: 'utf8mb4_unicode_ci', // 全域性設定 collate
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
      ],
    }
  )
}
