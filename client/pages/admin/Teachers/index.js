import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import AdminTab from '@/components/adminTab';
import styles from '@/styles/adminTeacher.module.scss';
import Pagination from '@/components/pagination';
import { Modal, Box, Button } from '@mui/material';
import SearchBar from '@/components/adminSearch'; 
import ViewButton from '@/components/adminCRUD/viewButton';
import EditButton from '@/components/adminCRUD/editButton';
import ToggleButton from '@/components/adminCRUD/toggleButton';
import axios from 'axios';

const ITEMS_PER_PAGE = 10;

const TeacherAdmin = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 初始化選中的 tab
  const [isToggled, setIsToggled] = useState(false); // 定義 isToggled 狀態

  // 獲取教師資料
  useEffect(() => {
    fetchTeachers();
  }, [activeTab]);

  const fetchTeachers = () => {
    axios
      .get('http://localhost:3005/api/teacher', {
        params: { keyword: searchTerm, status: activeTab === 'all' ? '' : activeTab }
      })
      .then((res) => setTeachers(res.data))
      .catch((error) => console.error('無法獲取教師資料:', error));
  };

  const handleSearch = () => {
    fetchTeachers();
  };

  const handleToggleClick = () => {
    setIsToggled(!isToggled);
    console.log('Toggle狀態:', isToggled ? '關閉' : '開啟');
  };

  const handleOpen = (teacher) => {
    setSelectedTeacher(teacher);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTeacher(null);
  };

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'active', label: '聘僱中' },
    { key: 'inactive', label: '已下架' },
  ];

  // 計算當前頁顯示的教師資料
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTeachers = teachers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(teachers.length / ITEMS_PER_PAGE);

  return (
    <AdminLayout>
      <div className={styles.teacherPage}>
        <SearchBar onSearch={handleSearch} setSearchTerm={setSearchTerm} />

        <AdminTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

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
                <td>
                  <img src={`/photos/teachers/${teacher.img_path}`} alt={teacher.name} className={styles.teacherImage} />
                </td>
                <td>{teacher.id}</td>
                <td>{teacher.name}</td>
                <td>{teacher.expertise}</td>
                <td>
                  <div className="d-flex gap-3">
                    <ViewButton onClick={() => handleOpen(teacher)} />
                    <Link href={`./Teachers/editTeacher`}>
                      <EditButton />
                    </Link>
                    <ToggleButton onClick={handleToggleClick} isActive={isToggled} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.paginationContainer}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      <Modal open={open} onClose={handleClose} aria-labelledby="teacher-modal-title">
        <Box sx={{ width: 400, padding: 4, margin: 'auto', mt: 10, backgroundColor: 'white', borderRadius: 2 }}>
          {selectedTeacher && (
            <>
              <h2 id="teacher-modal-title">{selectedTeacher.name}</h2>
              <img src={`/photos/teachers/${selectedTeacher.img_path}`} width={200} height={200} alt={selectedTeacher.name} />
              <table className="table table-hover">
                <tbody>
                  <tr>
                    <th>專業領域</th>
                    <td>{selectedTeacher.expertise}</td>
                  </tr>
                  {/* 其他資料欄位 */}
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

export default TeacherAdmin;
