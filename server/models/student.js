import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'student',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sign_up_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      canceled_time: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      order_info: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      reservation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      transaction_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'student',
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
