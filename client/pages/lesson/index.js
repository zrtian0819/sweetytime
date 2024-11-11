import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/header';
import Banner from '@/components/lesson/banner';
import LessonCard from '@/components/lesson/lesson-card';
import SmLesson from '@/components/lesson/small-lesson';
import FilterBox from '@/components/lesson/productFilter';
import Tags from '@/components/lesson/tag';
import IconClassFilter from '@/components/iconClassFilter';
import { FaRegCalendarAlt, FaSearch } from 'react-icons/fa';
import Pagination from '@/components/pagination';
import Footer from '@/components/footer';
import styles from '@/styles/lesson.module.scss';
import axios from 'axios';
import { filter } from 'lodash';

export default function Lesson() {
	const [showList, setShowList] = useState(false);
	const [lesson, setLesson] = useState([]);
	const [smLesson, setSmLesson] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [filterBox, setFilterBox] = useState([]);

	const ITEMS_PER_PAGE = 6; // 每頁顯示的卡片數量

	const showBox = () => {
		setShowList(!showList);
	};

	const handleFilterBox = (data) => {
		setFilterBox(data);
	};

	// 計算當前頁顯示的卡片範圍
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	let lessonToshow = lesson.slice(startIndex, endIndex);

	// 計算總頁數
	let totalPages = Math.ceil(lesson.length / ITEMS_PER_PAGE);

	if (filterBox == []) {
		lessonToshow = lesson.slice(startIndex, endIndex);
	} else {
		lessonToshow = filterBox.slice(startIndex, endIndex);
		totalPages = Math.ceil(filterBox.length / ITEMS_PER_PAGE);
	}
	console.log(filterBox);
	console.log(lessonToshow);

	useEffect(() => {
		// 請求 lesson 表數據
		axios
			.get('http://localhost:3005/api/lesson')
			.then((response) => setLesson(response.data))
			.catch((error) => console.error('Error fetching users:', error));
	}, []);

	// 右側小課程排序
	useEffect(() => {
		const showSmLesson = [...lesson]
			.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
			.slice(0, 6);
		setSmLesson(showSmLesson);
	}, [lesson]);

	useEffect(() => {
		setFilterBox(lesson);
	}, [lesson]);

	return (
		<>
			<Header />
			<Banner />
			<div className="container mt-2">
				<div className="row">
					<div className="filter-zone-pc d-none d-md-block">
						<FilterBox lesson={lesson} onFilter={handleFilterBox} />
						<div className="d-flex justify-content-center mb-4 mt-4">
							<IconClassFilter />
						</div>
						<Tags />
					</div>
					<div className="filter-box d-flex d-md-none justify-content-center gap-3">
						<input
							type="text"
							className={`${styles['CTH-keywords']}`}
							id="keywords"
							placeholder="搜尋課程"
						/>
						<button className={styles['CTH-search']}>
							<FaSearch className={styles['CTH-icon']} />
						</button>
						<button
							className={styles['CTH-calendar']}
							onClick={() => {
								showBox();
							}}
						>
							<FaRegCalendarAlt className={styles['CTH-icon']} />
						</button>
					</div>
				</div>
				{showList ? (
					<div className={`${styles['CTH-sm-lesson-box-filter']} d-md-none`}>
						<h2>即將開課</h2>
						{smLesson.map((lesson, index) => (
							<SmLesson
								id={lesson.id}
								name={lesson.name}
								month={lesson.start_date.slice(5, 7)}
								date={lesson.start_date.slice(8, 10)}
								dateStr={lesson.start_date}
								price={lesson.price}
							/>
						))}
					</div>
				) : (
					''
				)}
				<div className="lesson-info row justify-content-between">
					<div className="lesson-card-group d-flex flex-wrap col-lg-9 col-md-8 justify-content-around">
						{lessonToshow.map((lesson, index) => (
							<LessonCard
								id={lesson.id}
								img={lesson.img_path}
								name={lesson.name}
								date={lesson.start_date}
								price={`NTD ${lesson.price}`}
								des={lesson.description}
							/>
						))}
					</div>
					<div className={`${styles['CTH-sm-lesson-box']} col-lg-3 col-md-4`}>
						<div className="text-center mb-3">
							<h3>即將開課</h3>
							{smLesson.map((lesson, index) => (
								<SmLesson
									id={lesson.id}
									name={lesson.name}
									month={lesson.start_date.slice(5, 7)}
									date={lesson.start_date.slice(8, 10)}
									dateStr={lesson.start_date}
									price={lesson.price}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
			<div className="mt-5 mb-3">
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={(page) => setCurrentPage(page)}
					changeColor="#fe6f67"
				/>
			</div>
			<Footer />
		</>
	);
}
