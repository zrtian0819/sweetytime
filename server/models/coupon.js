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
        comment: '優惠券名稱',
      },
      discount_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: '折扣率',
      },
      type: {
        type: DataTypes.ENUM('PERCENT', 'FIXED'),
        allowNull: false,
        comment: '折扣類型：百分比或固定金額',
      },
      minimumSpend: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: '最低消費金額',
      },
      maximumDiscount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: '最高折扣金額',
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: '開始日期',
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: '結束日期',
      },
      shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '商店ID',
      },
      permenent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '是否永久有效',
      },
      activation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: '是否啟用',
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'AVAILABLE',
        comment: '優惠券狀態',
      },
      termsAndConditions: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '使用條款與條件',
      },
    },
    {
      sequelize,
      tableName: 'coupon',
      timestamps: true,
      charset: 'utf8mb4', // 全域性設定 charset
      collate: 'utf8mb4_unicode_ci', // 全域性設定 collate
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'idx_start_date',
          using: 'BTREE',
          fields: [{ name: 'start_date' }],
        },
        {
          name: 'idx_end_date',
          using: 'BTREE',
          fields: [{ name: 'end_date' }],
        },
        {
          name: 'idx_shop_id',
          using: 'BTREE',
          fields: [{ name: 'shop_id' }],
        },
      ],
    }
  )
}
