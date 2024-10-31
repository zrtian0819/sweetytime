// pages/admin/AdminTeacherList.js
import React, { useState } from 'react';
import AdminNavbar from '@/components/admin/adminNavbar';
import AdminSidebar from '@/components/admin/adminSidebar';
import AdminFooter from '@/components/admin/adminFooter';
import AdminTeacherCard from '@/components/admin/AdminTeacherCard';
import Pagination from '@/components/pagination';

const teachers = [
  { id: 1, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png' },
  { id: 2, name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
  // 可加入更多假資料
];

const ITEMS_PER_PAGE = 10;

const AdminTeacherList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const teachersToShow = teachers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(teachers.length / ITEMS_PER_PAGE);

  return (
    <div className="container-scroller">
      <AdminNavbar />
      <div className="container-fluid page-body-wrapper">
        <AdminSidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <h3>教師列表</h3>
            <div className="row">
              {teachersToShow.map((teacher) => (
                <div className="col-md-3 mb-4" key={teacher.id}>
                  <AdminTeacherCard teacher={teacher} />
                </div>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
          <AdminFooter />
        </div>
      </div>
    </div>
  );
};

export default AdminTeacherList;
