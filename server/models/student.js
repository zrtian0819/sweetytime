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
    },
    {
      sequelize,
      tableName: 'student',
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