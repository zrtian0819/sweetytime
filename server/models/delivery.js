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
