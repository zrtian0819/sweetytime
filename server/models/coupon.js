import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'coupon',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(225),
        allowNull: false,
      },
      discount_rate: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      start_time: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      shop_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      permenent: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      activation: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'coupon',
      timestamps: true,
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
