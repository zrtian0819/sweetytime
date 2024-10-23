import React, { useState } from 'react'; // 引入 useState
import TeacherStyles from '@/styles/teacher.module.scss'; 
import Header from '@/components/header'; 
import TeacherCard from '@/components/TeacherCard';
import Footer from '@/components/footer';
import Pagination from '@/components/pagination';
import TeacherSidebar from '@/components/teacherSidebar';


const teachers = [
  { id: 1, title:'甜點大師', name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
  { id: 1, title:'甜點大師', name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
  { id: 1, title:'甜點大師', name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
  { id: 1, title:'甜點大師', name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
  { id: 1, title:'甜點大師', name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
  { id: 1, title:'甜點大師', name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
  { id: 1, title:'甜點大師', name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
  { id: 1, title:'甜點大師', name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
  { id: 1, title:'甜點大師', name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
  { id: 1, title:'甜點大師', name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },

];

export default function TeacherPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 控制側邊欄的開啟和收合狀態

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // 切換側邊欄的開啟和收合狀態
  };

  return (
    <>
      <Header />
      <div className={TeacherStyles.teacherPage}>
        {/* 添加控制側邊欄收合的按鈕 */}
        <button className={TeacherStyles.toggleBtn} onClick={toggleSidebar}>
          {isSidebarOpen ? '收合篩選' : '展開篩選'}
        </button>

        {/* 根據 isSidebarOpen 狀態來顯示或隱藏側邊欄 */}
        {isSidebarOpen && <TeacherSidebar />}

        {/* 教師卡片列表 */}
        <div className={TeacherStyles.teacherGridContainer}>
          {teachers.map(teacher => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>

        {/* 分頁元件 */}
        <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
      </div>
      <Footer />
    </>
  );
}