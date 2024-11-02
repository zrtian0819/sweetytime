import React from 'react';
import Link from 'next/link';
import { Navbar, Form, FormControl } from 'react-bootstrap';
import styles from './admin-navbar.module.scss';

const AdminNavbar = () => {
  return (
    <Navbar expand="lg" className={`${styles.navbar} fixed-top`}>
      <div className="d-flex align-items-center">
        {/* 搜尋框 */}
        <Form inline className={styles.search}>
          <FormControl
            type="text"
            placeholder="Search..."
            className="mr-sm-2"
            style={{
              backgroundColor: '#f1f3f5',
              borderRadius: '20px',
              padding: '10px',
              width: '250px',
              border: 'none',
            }}
          />
        </Form>
      </div>

      <div className="d-flex align-items-center ml-auto">
        {/* Live 標籤 */}
        <div className={styles.liveBadge}>Live</div>

        {/* 圖標區域 */}
        <div className={`${styles.iconGroup} ml-3`}>
          <i className="mdi mdi-moon-outline" />
          <i className="mdi mdi-bell-outline mx-3" />
          <i className="mdi mdi-account-circle-outline" />
        </div>
      </div>
    </Navbar>
  );
};

export default AdminNavbar;
