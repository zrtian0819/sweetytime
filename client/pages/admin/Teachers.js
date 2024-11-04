import React, { useState } from 'react';
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

const initialTeachers = [
  { id: 1, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert', status: '聘僱中' },
  { id: 2, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert', status: '已下架' },
  { id: 3, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert', status: '聘僱中' },
  { id: 4, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert', status: '已下架' },
  { id: 5, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert', status: '聘僱中' },
  { id: 6, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert', status: '已下架' },
  { id: 7, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert', status: '聘僱中' },
  { id: 8, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert', status: '已下架' },
  { id: 9, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert', status: '聘僱中' },
  { id: 10, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert', status: '已下架' },
  { id: 11, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert', status: '聘僱中' },
  { id: 12, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert', status: '已下架' },
  { id: 13, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert', status: '聘僱中' },
  { id: 14, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert', status: '已下架' },
  { id: 15, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert', status: '聘僱中' },
];

const ITEMS_PER_PAGE = 10;

const teacherAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 初始化選中的 tab
  const [isToggled, setIsToggled] = useState(false); // 定義 isToggled 狀態

  const handleSearch = () => {
    console.log('搜尋按鈕被點擊');
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
    { key: 'all', label: '全部', content: '全部的教師清單' },
    { key: 'active', label: '聘僱中', content: '目前聘僱中的教師清單' },
    { key: 'inactive', label: '已下架', content: '已下架的教師清單' },
  ];

  const filteredTeachers = initialTeachers.filter((teacher) => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && teacher.status === '聘僱中';
    if (activeTab === 'inactive') return matchesSearch && teacher.status === '已下架';
    return matchesSearch;
  });

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTeachers = filteredTeachers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);

  return (
    <AdminLayout>
      <div className={styles.teacherPage}>
        <SearchBar onSearch={handleSearch} />

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
                <td><img src={teacher.imgSrc} alt={teacher.name} className={styles.teacherImage} /></td>
                <td>{teacher.id}</td>
                <td>{teacher.name}</td>
                <td>{teacher.title}</td>
                <td>
                  <div className="d-flex gap-3">
                    <ViewButton href={`./viewTeacher`} onClick={() => handleOpen(teacher)} />
                    <Link href={`./editTeacher`}>
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
              <img src={selectedTeacher.imgSrc} width={200} height={200} alt={selectedTeacher.name} />
              <table className="table table-hover">
                <tbody>
                  <tr>
                    <th>專業領域</th>
                    <td>{selectedTeacher.title}</td>
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

export default teacherAdmin;

