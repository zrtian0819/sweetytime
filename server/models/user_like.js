import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'user_like',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        comment: '唯一識別碼'
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '使用者ID，關聯到users表的id'
      },
      type: {
        type: DataTypes.ENUM('lesson', 'shop', 'product'),
        allowNull: true,
        comment: '收藏項目類型：課程(lesson)、商店(shop)、商品(product)'
      },
    },
    {
      sequelize,
      tableName: 'user_like',
      timestamps: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
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