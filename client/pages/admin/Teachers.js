import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import styles from '@/styles/teacherManager.module.scss';
import TeacherCard from '@/components/TeacherCard';
import Pagination from '@/components/pagination';
import { FaEye, FaEdit, FaToggleOn } from 'react-icons/fa';

const initialTeachers = [
	{ id: 1, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert' },
	{ id: 2, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert' },
	{ id: 3, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert' },
	{ id: 4, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert' },
	{ id: 5, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert' },
	{ id: 6, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert' },
	{ id: 7, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert' },
	{ id: 8, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert' },
	{ id: 9, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png', title: 'Baking Expert' },
	{
		id: 10,
		name: '王美姬 Maggie',
		imgSrc: '/photos/teachers/Maggie.png',
		title: 'Baking Expert',
	},
	{
		id: 11,
		name: '王美姬 Maggie',
		imgSrc: '/photos/teachers/Maggie.png',
		title: 'Baking Expert',
	},
	{
		id: 12,
		name: '王美姬 Maggie',
		imgSrc: '/photos/teachers/Maggie.png',
		title: 'Baking Expert',
	},
	{
		id: 13,
		name: '王美姬 Maggie',
		imgSrc: '/photos/teachers/Maggie.png',
		title: 'Baking Expert',
	},
	{
		id: 14,
		name: '王美姬 Maggie',
		imgSrc: '/photos/teachers/Maggie.png',
		title: 'Baking Expert',
	},
	{
		id: 15,
		name: '王美姬 Maggie',
		imgSrc: '/photos/teachers/Maggie.png',
		title: 'Baking Expert',
	},
];

const ITEMS_PER_PAGE = 10;

const MemberAPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTeachers = initialTeachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTeachers = filteredTeachers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);

  return (
    <AdminLayout>
      <div className={styles.teacherPage}>
        {/* 搜尋欄位 */}
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

        {/* 狀態篩選標籤 */}
        <div className={styles.statusTabs}>
          <button className={styles.activeTab}>全部</button>
          <button>聘僱中</button>
          <button>已下架</button>
        </div>

        {/* 教師列表表格 */}
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
                <td>{teacher.expertise}</td>
                <td>
                  <button className={styles.actionButton}><FaEye /></button>
                  <button className={styles.actionButton}><FaEdit /></button>
                  <button className={styles.actionButton}><FaToggleOn /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 分頁 */}
        <div className={styles.paginationContainer}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default MemberAPage;
