// pages/admin/index.js
import React from 'react';
import AdminNavbar from '@/components/adminNavbar';
import Sidebar from '@/components/adminSidebar';
import AdminMainContent from '@/components/adminMainContent';
import styles from '@/styles/admin.module.scss';

const AdminIndex = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <AdminNavbar />
        <AdminMainContent />
      </div>
    </div>
  );
};

export default AdminIndex;
