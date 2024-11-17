import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import Pagination from '@/components/pagination';
import ViewButton from '@/components/adminCRUD/viewButton';
import EditButton from '@/components/adminCRUD/editButton';
import ToggleButton from '@/components/adminCRUD/toggleButton';
import AdminTab from '@/components/adminTab';
import AddButton from '@/components/adminCRUD/addButton';
import SearchBar from '@/components/adminSearch';

import styles from '@/styles/adminLesson.module.scss';
import axios from 'axios';

export default function Lessons(props) {
	const [lesson, setLesson] = useState([]);
	const [filteredLesson, setFilteredLesson] = useState([]);
	const [stu, setStu] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [status, setStatus] = useState('all');
	const [keyword, setKeyWord] = useState('');
	const [clearBtn, setClearBtn] = useState(false);

	const tabs = [
		{ key: 'all', label: '全部' },
		{ key: 'open', label: '已上架課程' },
		{ key: 'close', label: '已下架課程' },
	];
	const ITEMS_PER_PAGE = 10; // 每頁顯示的數量

	// 計算當前頁顯示的卡片範圍
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const lessonToshow = filteredLesson.slice(startIndex, endIndex);

	// 計算總頁數
	const totalPages = Math.ceil(filteredLesson.length / ITEMS_PER_PAGE);

	//上下架 & 篩選
	const handleToggleClick = (lessonId, teacher_activation) => {
		if (teacher_activation == 0) {
			alert('請至老師列表頁操作');
		}
		axios
			.post(`http://localhost:3005/api/lesson/admin/${lessonId}`)
			.then((res) =>
				setLesson((lessons) =>
					lessons.map((course) =>
						course.id == lessonId ? { ...course, activation: res.data } : course
					)
				)
			)
			.catch((error) => console.error('更新失敗', error));
	};
	const filterLesson = () => {
		// 初始化篩選結果
		let filteredResults = lesson;
		// 根據 status 進行篩選
		if (status === 'open') {
			filteredResults = filteredResults.filter((course) => course.activation == 1);
		} else if (status === 'close') {
			filteredResults = filteredResults.filter((course) => course.activation == 0);
		}

		// 根據 keyword 進行篩選
		if (keyword) {
			filteredResults = filteredResults.filter((course) =>
				course.lesson_name.includes(keyword)
			);
		}

		setFilteredLesson(filteredResults);

		if (filteredResults.length < 1) {
			setCurrentPage(1);
		}
	};
	const handleKeywordChange = (newKeyword) => {
		setKeyWord(newKeyword);
		setClearBtn(newKeyword.length > 0);
	};
	const handleSearchBtn = () => {
		filterLesson();
	};

	const onRecover = () => {
		setKeyWord('');
		setClearBtn(false);
		setFilteredLesson(lesson);
	};
	useEffect(() => {
		setCurrentPage(1);
	}, [status]);

	useEffect(() => {
		filterLesson();
	}, [status, lesson]);

	//初始化課程資料
	useEffect(() => {
		axios
			.get('http://localhost:3005/api/lesson/admin')
			.then((res) => setLesson(res.data))
			.catch((error) => console.error('拿不到資料', error));
	}, []);
	console.log(lesson);
	//初始化報名資料
	useEffect(() => {
		axios
			.get('http://localhost:3005/api/lesson/student')
			.then((res) => {
				setStu(res.data.sort((a, b) => a.lesson_id - b.lesson_id));
			})
			.catch((error) => console.error('拿不到資料', error));
	}, []);
	return (
		<>
			<AdminLayout
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={(page) => setCurrentPage(page)}
			>
				<div className="d-flex justify-content-between">
					<SearchBar
						keyword={keyword}
						onKeywordChange={handleKeywordChange}
						handleSearchChange={handleSearchBtn}
						onRecover={clearBtn ? onRecover : null}
					/>
					<AddButton href="/admin/Lessons/addLesson" />
				</div>
				<AdminTab tabs={tabs} activeTab={status} setActiveTab={setStatus} />
				<table className={`${styles['CTH-table']} w-100 mb-5`}>
					<thead class="text-center">
						<tr>
							<th>課程編號</th>
							<th>課程狀態</th>
							<th>課程名稱</th>
							<th>課程分類</th>
							<th>授課老師</th>
							<th>課程時間</th>
							<th>課程人數</th>
							<th>報名人數</th>
							<th>啟用</th>
							<th>操作</th>
						</tr>
					</thead>
					<tbody>
						{lesson.length && stu.length > 0 ? (
							<>
								{lessonToshow.map((data, index) => {
									return (
										<>
											<tr class="text-center m-auto align-middle">
												<td>{data.id}</td>
												<td>
													{data.activation == 1 &&
													data.teacher_activation == 1
														? '上架中'
														: '已下架'}
												</td>
												<td>{data.lesson_name}</td>
												<td>{data.class_name}</td>
												<td>{data.teacher_name}</td>
												<td>{data.start_date}</td>
												<td>{data.quota}</td>
												<td>
													{stu.find(
														(dataStu) => dataStu.lesson_id === data.id
													)?.student_count || 0}
												</td>
												<td>
													<ToggleButton
														onClick={() => {
															handleToggleClick(
																data.id,
																data.teacher_activation
															);
														}}
														isActive={
															data.activation == 1 &&
															data.teacher_activation == 1
														}
													/>
												</td>
												<td>
													<div className="d-flex gap-3 justify-content-center align-items-center">
														<Link
															href={`./Lessons/viewLesson/${data.id}`}
														>
															<ViewButton />
														</Link>
														{data.teacher_activation == 0 ? (
															<>
																<div>請至師資列表頁編輯</div>
															</>
														) : (
															<Link
																href={`./Lessons/editLesson/${data.id}`}
															>
																<EditButton />
															</Link>
														)}
													</div>
												</td>
											</tr>
										</>
									);
								})}
							</>
						) : (
							''
						)}
					</tbody>
				</table>
			</AdminLayout>
		</>
	);
}
