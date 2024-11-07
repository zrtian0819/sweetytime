import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'product',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      shop_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      product_class_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      keywords: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      stocks: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      available: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: true,
      },
      discount: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      label: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      deleted: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      edit_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      last_edited_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'product',
      timestamps: true,
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
