// pages/admin/MemberAPage.js
import React, { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import styles from '@/styles/adminTeacher.module.scss';
import Pagination from '@/components/pagination';
import { FaEye, FaEdit, FaToggleOn } from 'react-icons/fa';
import { Modal, Box, Button } from '@mui/material';

const initialTeachers = [
  { id: 1, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert' },
  { id: 2, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert' },
  // 更多假資料...
];

const ITEMS_PER_PAGE = 10;

const MemberAPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const handleOpen = (teacher) => {
    setSelectedTeacher(teacher);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTeacher(null);
  };

  const filteredTeachers = initialTeachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTeachers = filteredTeachers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);

  return (
    <AdminLayout>
      <div className={styles.teacherPage}>
        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="搜尋教師..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>🔍</button>
        </div>

        {/* Status Tabs */}
        <div className={styles.statusTabs}>
          <button className={styles.activeTab}>全部</button>
          <button>聘僱中</button>
          <button>已下架</button>
        </div>

        {/* Teacher List Table */}
        <table className={styles.teacherTable}>
          <thead>
            <tr>
              <th>Image</th>
              <th>ID</th>
              <th>Name</th>
              <th>Expertise</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTeachers.map((teacher) => (
              <tr key={teacher.id}>
                <td><img src={teacher.imgSrc} alt={teacher.name} className={styles.teacherImage} /></td>
                <td>{teacher.id}</td>
                <td>{teacher.name}</td>
                <td>{teacher.title}</td>
                <td>
                  <button className={styles.actionButton} onClick={() => handleOpen(teacher)}>
                    <FaEye />
                  </button>
                  <Link href={`./editTeacher`}>
                    <button className={styles.actionButton}><FaEdit /></button>
                  </Link>
                  <Link href={`/toggleTeacher?id=${teacher.id}`}>
                    <button className={styles.actionButton}><FaToggleOn /></button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className={styles.paginationContainer}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* Modal for Teacher Details */}
      <Modal open={open} onClose={handleClose} aria-labelledby="teacher-modal-title">
        <Box sx={{ width: 400, padding: 4, margin: 'auto', mt: 10, backgroundColor: 'white', borderRadius: 2 }}>
          {selectedTeacher && (
            <>
              <h2 id="teacher-modal-title">{selectedTeacher.name}</h2>
              <img src={selectedTeacher.imgSrc} width={200} height={200} alt={selectedTeacher.name} />
              <table className="table table-hover">
                <tbody>
                  <tr>
                    <th>專業領域</th>
                    <td>{selectedTeacher.title}</td>
                  </tr>
                  <tr>
                    <th>經歷</th>
                    <td>10年以上的糕點製作經驗</td>
                  </tr>
                  <tr>
                    <th>學歷</th>
                    <td>食品科學碩士</td>
                  </tr>
                  <tr>
                    <th>證書</th>
                    <td>專業糕點師證書</td>
                  </tr>
                  <tr>
                    <th>獎項</th>
                    <td>全國糕點比賽冠軍</td>
                  </tr>
                  <tr>
                    <th>簡介</th>
                    <td>擁有豐富的糕點製作經驗，擅長創意糕點設計。</td>
                  </tr>
                  <tr>
                    <th>狀態</th>
                    <td>{selectedTeacher.valid ? "有效" : "無效"}</td>
                  </tr>
                </tbody>
              </table>
              <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
                關閉
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </AdminLayout>
  );
};

export default MemberAPage;
