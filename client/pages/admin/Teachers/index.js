import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import AdminTab from '@/components/adminTab';
import styles from '@/styles/adminTeacher.module.scss';
import Pagination from '@/components/pagination';
import SearchBar from '@/components/adminSearch';
import ViewButton from '@/components/adminCRUD/viewButton';
import EditButton from '@/components/adminCRUD/editButton';
import ToggleButton from '@/components/adminCRUD/toggleButton';
import AddButton from '@/components/adminCRUD/addButton';
import SwalDetails from '@/components/teacherSwal';
import 'animate.css';
import axios from 'axios';

const ITEMS_PER_PAGE = 10;

const TeacherAdmin = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isToggled, setIsToggled] = useState(false);
  const [clearBtn, setClearBtn] = useState(false);

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'active', label: '聘僱中' },
    { key: 'inactive', label: '已下架' },
  ];

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = () => {
    axios
      .get('http://localhost:3005/api/teacher')
      .then((res) => {
        setTeachers(res.data);
        setFilteredTeachers(res.data);
      })
      .catch((error) => console.error('無法獲取教師資料:', error));
  };

  const applyFilters = () => {
    const results = teachers.filter((teacher) => {
      const statusMatch =
        activeTab === 'all' ||
        (activeTab === 'active' && teacher.status === 'active') ||
        (activeTab === 'inactive' && teacher.status === 'inactive');

      const searchMatch =
        !searchTerm ||
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.expertise.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && searchMatch;
    });
    setFilteredTeachers(results);
  };

  const handleSearch = () => {
    applyFilters();
  };

  const handleKeywordChange = (newKeyword) => {
    setSearchTerm(newKeyword);
    setClearBtn(newKeyword.length > 0);
  };

  const onRecover = () => {
    setSearchTerm('');
    setClearBtn(false);
    setActiveTab('all');
    setFilteredTeachers(teachers);
  };

  const handleToggleClick = () => {
    setIsToggled(!isToggled);
    console.log('Toggle狀態:', isToggled ? '關閉' : '開啟');
  };

  const handleViewClick = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTeachers = filteredTeachers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);

  return (
    <AdminLayout>
      <div className={styles.teacherPage}>
        <div className="d-flex flex-row justify-content-between pe-3">
          <SearchBar
            keyword={searchTerm}
            onKeywordChange={handleKeywordChange}
            handleSearchChange={handleSearch}
            onRecover={clearBtn ? onRecover : null}
          />
          <AddButton />
        </div>

        <AdminTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <table className={styles.teacherTable}>
          <thead className={styles.teacherTitle}>
            <tr>
              <th>Image</th>
              <th>ID</th>
              <th>Name</th>
              <th>Expertise</th>
              <th>Status</th>
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
                    <ViewButton onClick={() => handleViewClick(teacher)} />
                    <Link href={`/admin/Teachers/editTeacher/${teacher.id}`}>
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

        {selectedTeacher && (
          <SwalDetails
            teacherView={{
              title: selectedTeacher.name,
              imgSrc: `/photos/teachers/${selectedTeacher.img_path}`,
              expertise: selectedTeacher.expertise,
              experience: selectedTeacher.experience,
              education: selectedTeacher.education,
              licence: selectedTeacher.licence,
              awards: selectedTeacher.awards,
              description: selectedTeacher.description,
              status: selectedTeacher.valid ? '有效' : '無效',
            }}
            onClose={() => setSelectedTeacher(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default TeacherAdmin;
