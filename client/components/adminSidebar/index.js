import React from 'react';
import Link from 'next/link';
import styles from './admin-sidebar.module.scss';
import { MdHome, MdPersonOutline, MdSchool, MdBook, MdShoppingCart, MdStore, MdLibraryBooks } from 'react-icons/md';

const menuItems = [
  { name: 'Home', path: '/admin/home', icon: <MdHome /> },
  { name: 'Members', path: '/admin/Members', icon: <MdPersonOutline /> },
  { name: 'Teachers', path: '/admin/teachers', icon: <MdSchool /> },
  { name: 'Lessons', path: '/admin/Lessons', icon: <MdBook /> },
  { name: 'Products', path: '/admin/products', icon: <MdShoppingCart /> },
  { name: 'Stores', path: '/admin/stores', icon: <MdStore /> },
  { name: 'Articles', path: '/admin/Articles', icon: <MdLibraryBooks /> },
];

const AdminSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <ul className={styles.navList}>
        {menuItems.map((item, index) => (
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
