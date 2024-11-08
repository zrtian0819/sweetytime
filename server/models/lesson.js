import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'lesson',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      product_class_id: {
        type: DataTypes.INTEGER,
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
      price: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      quota: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      classroom_name: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      discount: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      activation: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'lesson',
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
