import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import Pagination from '@/components/pagination';
import ViewButton from '@/components/adminCRUD/viewButton';
import EditButton from '@/components/adminCRUD/editButton';
import ToggleButton from '@/components/adminCRUD/toggleButton';
import AdminTab from '@/components/adminTab';
import styles from '@/styles/adminLesson.module.scss';
import axios from 'axios';

export default function Lessons(props) {
	const [lesson, setLesson] = useState([]);
	const [filteredLesson, setFilteredLesson] = useState([]);
	const [stu, setStu] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [status, setStatus] = useState('all');

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
	const handleToggleClick = (lessonId) => {
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
		if (status === 'open') {
			setFilteredLesson(lesson.filter((course) => course.activation == 1));
		} else if (status === 'close') {
			setFilteredLesson(lesson.filter((course) => course.activation == 0));
		} else {
			setFilteredLesson(lesson);
		}
		if (lessonToshow.length < 1) {
			setCurrentPage(1);
		}
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
			<AdminLayout>
				<AdminTab tabs={tabs} activeTab={status} setActiveTab={setStatus} />
				<table className={`${styles['CTH-table']} w-100`}>
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
							<th>詳細資訊</th>
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
													{data.activation == 1 ? '上架中' : '已下架'}
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
													<div className="d-flex gap-3 justify-content-center">
														<Link
															href={`./Lessons/viewLesson/${data.id}`}
														>
															<ViewButton />
														</Link>
														<Link
															href={`./Lessons/editLesson/${data.id}`}
														>
															<EditButton />
														</Link>
														<ToggleButton
															onClick={() => {
																handleToggleClick(data.id);
															}}
															isActive={data.activation == 1}
														/>
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
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={(page) => setCurrentPage(page)}
					changeColor="#fe6f67"
				/>
			</AdminLayout>
		</>
	);
}
