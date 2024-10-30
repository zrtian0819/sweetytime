import React from 'react';
import Link from 'next/link';
import styles from './admin-sidebar.module.scss';

const menuItems = [
  { name: 'Home', path: '/admin/home', icon: 'mdi mdi-home-outline' },
  { name: 'Students', path: '/admin/students', icon: 'mdi mdi-account-outline' },
  { name: 'Teachers', path: '/admin/teachers', icon: 'mdi mdi-school-outline' },
  { name: 'Courses', path: '/admin/courses', icon: 'mdi mdi-book-outline' },
  { name: 'Live Class', path: '/admin/live-class', icon: 'mdi mdi-video-outline' },
  { name: 'Attendance', path: '/admin/attendance', icon: 'mdi mdi-check-outline' },
  { name: 'Payments', path: '/admin/payments', icon: 'mdi mdi-cash-outline' },
  { name: 'Library', path: '/admin/library', icon: 'mdi mdi-library-outline' },
  { name: 'Reports', path: '/admin/reports', icon: 'mdi mdi-chart-line' },
];

const AdminSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      {/* <div className={styles.logo}>
        <Link href="/">Sweety Time</Link>
      </div> */}
      <ul className={styles.navList}>
        {menuItems.map((item, index) => (
          <li key={index} className={styles.navItem}>
            <Link href={item.path}>
              <span>
                <i className={`${item.icon} ${styles.icon}`}></i>
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
