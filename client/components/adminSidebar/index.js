import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './admin-sidebar.module.scss';
import { useUser } from '@/context/userContext';

import {
  MdHome,
  MdPersonOutline,
  MdSchool,
  MdBook,
  MdShoppingCart,
  MdStore,
  MdLibraryBooks,
} from 'react-icons/md';

const AdminSidebar = () => {
  const { user } = useUser(); // 從 context 獲取當前用戶資訊

  // 根據用戶角色定義可見的選單項目
  const getMenuItems = (userRole) => {
    const baseItems = [
      { name: 'Home', path: '/admin', icon: <MdHome /> },
      { name: 'Products', path: '/admin/Products', icon: <MdShoppingCart /> },
      { name: 'Stores', path: '/admin/Stores', icon: <MdStore /> },
      { name: 'News', path: '/admin/News', icon: <MdLibraryBooks /> },
    ];

    // 如果用戶是 admin，添加額外的選單項目
    if (userRole === 'admin') {
      return [
        ...baseItems,
        { name: 'Members', path: '/admin/Members', icon: <MdPersonOutline /> },
        { name: 'Teachers', path: '/admin/Teachers', icon: <MdSchool /> },
        { name: 'Lessons', path: '/admin/Lessons', icon: <MdBook /> },
      ];
    }

    // 對於 shop 角色，只返回基本選單項目
    return baseItems;
  };

  // 獲取當前用戶可見的選單項目
  const visibleMenuItems = getMenuItems(user?.role);

  return (
    <aside className={styles.sidebar}>
      <ul className={styles.navList}>
        {visibleMenuItems.map((item, index) => (
          <li key={index} className={styles.navItem}>
            <Link href={item.path}>
              <span className={styles.linkContent}>
                {item.icon}
                <span>{item.name}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default AdminSidebar;