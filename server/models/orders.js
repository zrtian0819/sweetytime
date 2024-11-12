import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'orders',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      status: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      shop_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      coupon_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      payment: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      delivery: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      delivery_address: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      delivery_name: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      delivery_phone: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      note: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      order_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      total_price: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      ship_pay: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'orders',
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
