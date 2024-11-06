import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'delivery',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      class_name: {
        type: DataTypes.STRING(225),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'delivery',
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
