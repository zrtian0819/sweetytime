import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import TeacherStyles from '@/styles/teacherDetail.module.scss';
import TeacherCard from '@/components/TeacherCard';
import ExpandButton from '@/components/button/expand-button';
import Link from 'next/link';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import LoaderThreeDots from '@/components/loader/loader-threeDots';

export default function TeacherDetail({ id }) {
	const [teacher, setTeacher] = useState(null);
	const [otherTeachers, setOtherTeachers] = useState([]);

	useEffect(() => {
		// Fetch teacher details by ID
		axios
			.get(`http://localhost:3005/api/teacher/teacherDetail/${id}`)
			.then((res) => setTeacher(res.data))
			.catch((error) => console.error('Error fetching teacher details:', error));

		// Fetch other teachers and shuffle for random display
		axios
			.get('http://localhost:3005/api/teacher')
			.then((res) => {
				const shuffledTeachers = res.data
					.filter((t) => t.id !== id)
					.sort(() => 0.5 - Math.random());
				setOtherTeachers(shuffledTeachers.slice(0, 4)); // 限制顯示數量為 4
			})
			.catch((error) => console.error('Error fetching other teachers:', error));
	}, [id]);

	// if (!teacher) return <div>Loading...</div>;<LoaderThreeDots/>
	if (!teacher) return <LoaderThreeDots />;

	const teacherDetails = [
		{ title: 'EDUCATION', content: teacher.education },
		{ title: 'AWARDS', content: teacher.awards },
		{ title: 'LICENCE', content: teacher.licence },
		{ title: 'EXPERIENCE', content: teacher.experience },
		{ title: 'INTRODUCTION', content: teacher.description },
	];

	return (
		<>
			<Header />
			<Container fluid className={TeacherStyles.teacherDetail}>
				<div className={TeacherStyles.btnContainer}>
					<Link href="/teacher" passHref>
						<ExpandButton value="返回師資列表" />
					</Link>
				</div>

				<div className={`${TeacherStyles.contentContainer} mt-5`}>
					{/* 左側：教師圖片和標題 */}
					<div className={`${TeacherStyles.section1}`}>
						<div className={TeacherStyles.imageBox}>
							<img
								src={`/photos/teachers/${teacher.img_path}`}
								alt={teacher.name}
								className="img-fluid rounded"
							/>
							<h3 className={`${TeacherStyles.titleContainer} text-center mt-3`}>
								{teacher.title} | {teacher.name}
							</h3>
						</div>
					</div>

					{/* 右側：教師詳細資訊 */}
					<div className={`${TeacherStyles.section2}`}>
						{teacherDetails.map((detail, index) => (
							<div key={index} className={TeacherStyles.textBox}>
								<h3 className={TeacherStyles.title}>{detail.title}</h3>
								<p>{detail.content}</p>
							</div>
						))}
					</div>
				</div>

				{/* 其他老師區塊 */}
				<div className={`${TeacherStyles.otherBox} mt-5`}>
					<h3 className="text-center mb-4">其他老師</h3>
					<div className={`${TeacherStyles.teacherCards} d-flex justify-content-center`}>
						{otherTeachers.map((otherTeacher) => (
							<div
								key={otherTeacher.id}
								className={`${TeacherStyles.teacherCard} d-flex align-items-center justify-content-center mb-4`}
							>
								<TeacherCard teacher={otherTeacher} />
							</div>
						))}
					</div>
				</div>
			</Container>
			<Footer bgColor="#FAAEB0" />
		</>
	);
}

export async function getServerSideProps(context) {
	const { id } = context.query;
	return { props: { id } };
}
