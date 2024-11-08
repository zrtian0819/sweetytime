import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'users_coupon',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      coupon_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      recieved_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      used_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      user_collected: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'users_coupon',
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
