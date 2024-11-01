import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import styles from '@/styles/teacherManager.module.scss';
import TeacherCard from '@/components/TeacherCard';
import Pagination from '@/components/pagination';
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

const ITEMS_PER_PAGE = 10; // 每頁顯示10個卡片

const MemberAPage = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);

	// 過濾後的教師列表
	const filteredTeachers = initialTeachers.filter((teacher) =>
		teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// 分頁資料
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentTeachers = filteredTeachers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);

	return (
		<AdminLayout>
			<div>
				{/* 搜尋欄位 */}
				<input
					type="text"
					placeholder="搜尋教師"
					value={searchTerm}
					onChange={(e) => {
						setSearchTerm(e.target.value);
						setCurrentPage(1); // 搜尋時重置為第一頁
					}}
					className={styles.searchInput}
				/>

				{/* 教師卡片列表 */}
				<div className={styles.teacherList}>
					{currentTeachers.map((teacher) => (
						<TeacherCard key={teacher.id} teacher={teacher} />
					))}
				</div>

				<div className="mb-5">
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
