import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'shop',
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
      name: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sign_up_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      logo_path: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      latitude: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'shop',
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
