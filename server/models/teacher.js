import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'teacher',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      img_path: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      expertise: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      experience: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      education: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      licence: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      awards: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'teacher',
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
