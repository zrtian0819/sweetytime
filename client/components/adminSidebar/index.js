// components/adminSidebar.js
import React from 'react';
import Link from 'next/link';

const AdminSidebar = () => {
  return (
    <div className="bg-danger text-white position-fixed vh-100" style={{ width: '250px' }}>
      <div className="p-4">
        <h3>甜覓食光</h3>
      </div>
      <ul className="nav flex-column px-3">
        <li className="nav-item mb-3">
          <Link href="/admin/dashboard" legacyBehavior>
            <span className="nav-link text-white" style={{ cursor: 'pointer' }}>
              <i className="mdi mdi-view-dashboard-outline mr-2"></i> Dashboard
            </span>
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link href="/admin/ui-elements" legacyBehavior>
            <span className="nav-link text-white" style={{ cursor: 'pointer' }}>
              <i className="mdi mdi-widgets-outline mr-2"></i> UI Elements
            </span>
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link href="/admin/forms" legacyBehavior>
            <span className="nav-link text-white" style={{ cursor: 'pointer' }}>
              <i className="mdi mdi-format-list-bulleted mr-2"></i> Form Elements
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
