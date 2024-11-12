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

const ITEMS_PER_PAGE = 5;

const TeacherAdmin = () => {
	const [teachers, setTeachers] = useState([]);
	const [filteredTeachers, setFilteredTeachers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedTeacher, setSelectedTeacher] = useState(null);
	const [activeTab, setActiveTab] = useState('all'); // 預設為「全部」
	const [teacherStatus, setTeacherStatus] = useState({}); // 儲存教師的啟用狀態

	const tabs = [
		{ key: 'all', label: '全部' },
		{ key: 'active', label: '聘僱中' },
		{ key: 'inactive', label: '已下架' },
	];

	// 初始化抓取教師資料
	useEffect(() => {
		fetchTeachers();
	}, []);

	const fetchTeachers = async () => {
		try {
			const res = await axios.get('http://localhost:3005/api/teacher');
			const data = res.data;

			// 使用資料中的 activation 欄位設置教師狀態
			const initialStatus = {};
			data.forEach((teacher) => {
				initialStatus[teacher.id] = parseInt(teacher.activation); // 將 activation 轉換成整數
			});

			setTeacherStatus(initialStatus);
			setTeachers(data);
			setFilteredTeachers(data);
		} catch (error) {
			console.error('無法獲取教師資料:', error);
		}
	};

	// 更新教師資料的篩選結果
	const applyFilters = () => {
		const filtered = teachers.filter((teacher) => {
			const statusMatch =
				activeTab === 'all' ||
				(activeTab === 'active' && teacherStatus[teacher.id] === 1) ||
				(activeTab === 'inactive' && teacherStatus[teacher.id] === 0);

			const searchMatch =
				!searchTerm ||
				teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				teacher.expertise.toLowerCase().includes(searchTerm.toLowerCase());

			return statusMatch && searchMatch;
		});
		setFilteredTeachers(filtered);
		setCurrentPage(1); // 切換篩選條件後重置分頁
	};

	// 當標籤或啟用狀態改變時自動篩選
	useEffect(() => {
		applyFilters();
	}, [activeTab, searchTerm, teachers]);

	// 切換啟用/停用狀態
	const handleToggleClick = async (teacherId) => {
		const newStatus = teacherStatus[teacherId] === 1 ? 0 : 1;
		try {
			await axios.put(`http://localhost:3005/api/teacher/toggleStatus/${teacherId}`, { activation: newStatus });
			setTeacherStatus((prevStatus) => ({
				...prevStatus,
				[teacherId]: newStatus,
			}));
			// 更新狀態後重新應用篩選條件
			applyFilters();
		} catch (error) {
			console.error('更新教師狀態失敗:', error);
			alert('更新失敗，請重試');
		}
	};

	const handleSearchChange = (newKeyword) => {
		setSearchTerm(newKeyword);
	};

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentTeachers = filteredTeachers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);

	const handleTabChange = (key) => {
		setActiveTab(key);
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	return (
		<AdminLayout
		>
			<div className={styles.teacherPage}>
				<div className="d-flex flex-row justify-content-between pe-3">
					<SearchBar
						keyword={searchTerm}
						onKeywordChange={handleSearchChange}
					/>
					<AddButton href={'./Teachers/addTeacher'} />
				</div>
				<AdminTab tabs={tabs} activeTab={activeTab} setActiveTab={handleTabChange} />

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
									<img
										src={`/photos/teachers/${teacher.img_path}`}
										alt={teacher.name}
										className={styles.teacherImage}
									/>
								</td>
								<td>{teacher.id}</td>
								<td>{teacher.name}</td>
								<td>{teacher.expertise}</td>
								<td>
    <div className="d-flex align-items-center justify-content-center gap-3">
        <ViewButton onClick={() => setSelectedTeacher(teacher)} />
        <Link href={`/admin/Teachers/editTeacher/${teacher.id}`}>
            <EditButton />
        </Link>
        <ToggleButton
            isActive={teacherStatus[teacher.id] === 1}
            onClick={() => handleToggleClick(teacher.id)}
        />
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
						onPageChange={handlePageChange}
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
							status: teacherStatus[selectedTeacher.id] === 1 ? '有效' : '無效',
						}}
						onClose={() => setSelectedTeacher(null)}
					/>
				)}
			</div>
		</AdminLayout>
	);
};

export default TeacherAdmin;
