import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
import notFound from '@/components/sweetAlert/notFound';
import 'animate.css';
import axios from 'axios';

const ITEMS_PER_PAGE = 8;

const TeacherAdmin = () => {
	const router = useRouter();
	const [teachers, setTeachers] = useState([]);
	const [filteredTeachers, setFilteredTeachers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedTeacher, setSelectedTeacher] = useState(null);
	const [activeTab, setActiveTab] = useState('all');
	const [teacherStatus, setTeacherStatus] = useState({});

	const tabs = [
		{ key: 'all', label: '全部' },
		{ key: 'active', label: '聘僱中' },
		{ key: 'inactive', label: '已下架' },
	];

	useEffect(() => {
		fetchTeachers();
	}, []);

	const fetchTeachers = async () => {
		try {
			const res = await axios.get('http://localhost:3005/api/teacher');
			const data = res.data;

			const initialStatus = {};
			data.forEach((teacher) => {
				initialStatus[teacher.id] = parseInt(teacher.activation);
			});

			setTeacherStatus(initialStatus);
			setTeachers(data);
			setFilteredTeachers(data);
		} catch (error) {
			console.error('無法獲取教師資料:', error);
		}
	};

	useEffect(() => {
		if (router.query.reload) {
			fetchTeachers();
		}
	}, [router.query]);

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
		setCurrentPage(1);
	};

	//not found
	useEffect(() => {
		if (filteredTeachers.length === 0 && searchTerm) {
			notFound({
				title: `找不到與"${searchTerm}"相關的老師`,
				text: '請嘗試其他關鍵字或篩選條件',
			});

			setSearchTerm('');
			setFilteredTeachers(teachers);
			return;
		}
	}, [filteredTeachers, searchTerm]);

	//

	useEffect(() => {
		applyFilters();
	}, [activeTab, teachers]);

	const handleToggleClick = async (teacherId) => {
		const newStatus = teacherStatus[teacherId] === 1 ? 0 : 1;
		try {
			await axios.put(`http://localhost:3005/api/teacher/toggleStatus/${teacherId}`, {
				activation: newStatus,
			});
			setTeacherStatus((prevStatus) => ({
				...prevStatus,
				[teacherId]: newStatus,
			}));
			applyFilters();
		} catch (error) {
			console.error('更新教師狀態失敗:', error);
			alert('更新失敗，請重試');
		}
	};

	const handleSearchChange = (newKeyword) => {
		setSearchTerm(newKeyword);
	};
	const handleSearchBtn = () => {
		applyFilters();
	};
	const onRecover = () => {
		setSearchTerm('');
		setActiveTab('all');
		setFilteredTeachers(teachers);
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
			currentPage={currentPage}
			totalPages={totalPages}
			onPageChange={(page) => setCurrentPage(page)}
		>
			<div className={`${styles.teacherPage}`}>
				<div className="d-flex flex-row justify-content-between pe-3">
					<SearchBar
						keyword={searchTerm}
						onKeywordChange={handleSearchChange}
						handleSearchChange={handleSearchBtn}
						onRecover={onRecover}
					/>
					<AddButton href={'./Teachers/addTeacher'} />
				</div>
				<AdminTab tabs={tabs} activeTab={activeTab} setActiveTab={handleTabChange} />

				<div style={{ overflowY: 'auto', maxHeight: '86%' }}>
					<table className={styles.teacherTable}>
						<thead className={styles.teacherTitle}>
							<tr>
								<th>ID</th>
								<th>圖片</th>
								<th>名稱</th>
								<th>專業技能</th>
								<th>啟用</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							{currentTeachers.map((teacher) => (
								<tr key={teacher.id}>
									<td>{teacher.id}</td>
									<td>
										<img
											src={`/photos/teachers/${teacher.img_path}`}
											alt={teacher.name}
											className={styles.teacherImage}
										/>
									</td>
									<td>{teacher.name}</td>
									<td>
										{teacher.expertise.length > 15
											? teacher.expertise.slice(0, 15) + '...'
											: teacher.expertise}
									</td>
									<td>
										<div className="d-flex gap-3 justify-content-center">
											<ToggleButton
												isActive={teacherStatus[teacher.id] === 1}
												onClick={() => handleToggleClick(teacher.id)}
											/>
										</div>
									</td>
									<td>
										<div className="d-flex gap-3 justify-content-center">
											<ViewButton
												onClick={() => setSelectedTeacher(teacher)}
											/>
											<Link
												href={`/admin/Teachers/editTeacher/${teacher.id}`}
											>
												<EditButton />
											</Link>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
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
							status: teacherStatus[selectedTeacher.id] === 1 ? '聘僱中' : '已下架',
						}}
						onClose={() => setSelectedTeacher(null)}
					/>
				)}
			</div>
		</AdminLayout>
	);
};

export default TeacherAdmin;
