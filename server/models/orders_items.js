import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'orders_items',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      product_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      amount: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      that_time_price: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'orders_items',
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
