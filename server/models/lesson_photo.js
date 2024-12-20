import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'lesson_photo',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      file_name: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      is_valid: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'lesson_photo',
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
