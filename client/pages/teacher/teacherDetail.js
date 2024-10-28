import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import TeacherStyles from '@/styles/teacherDetail.module.scss';
import TeacherCard from '@/components/TeacherCard';
import SquareButton from '@/components/button/square-button';
import Link from 'next/link';

const otherTeachers = [
	{ id: 1, name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
	{ id: 1, name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
	{ id: 1, name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
	{ id: 1, name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
];

export default function TeacherDetail() {
	const teacher = {
		id: 1,
		name: 'Maggie 王美姬',
		title: '甜點大師',
		imgSrc: '/photos/teachers/Maggie.png',
		description:
			'出生於內蒙古河套平原的王美姬老師，在春耕秋實的環境中長大，傳承自媽媽的好手藝，從事點心製作十多年時間，首創3D立體造型饅頭，原創造型超過一千款，美姬饅頭年銷量突破一百萬顆，學生遍布全球。 目前致力於推廣健康無添加的創新藝術點心，在全世界掀起一波波的熱潮，帶動產業流行，同時發揚中式點心文化。',
		experience:
			'啦啦啦內蒙古河套平原的王美姬老師，在春耕秋實的環境中長大，傳承自媽媽的好手藝，從事點心製作十多年時間，首創3D立體造型饅頭，原創造型超過一千款，美姬饅頭年銷量突破一百萬顆，學生遍布全球。',
		award: 'Google、Facebook 網路人氣第一名誠品、博客來、金石堂、淘寶網、紀伊國屋、大眾網書 暢銷書作家最新著作《卡哇伊造型蛋黃酥》出版日期：2022/8/9榮獲momo暢銷書榜第出版日期：2021/7/1榮獲博客來全館即時榜第1名!!榮獲博客來中文飲食類新書暢銷榜第1名!!2021博客來年度百大暢銷榜第75名!! 著作《卡哇伊節日&活動造型饅頭》出版日期：2021/4/1 榮獲博客來中文飲食類新書暢銷榜第2名!!著作《卡哇伊一口小饅頭》出版日',
		edu: 'Google、Facebook 網路人氣第一名誠品、博客來、金石堂、淘寶網、紀伊國屋、大眾網書 暢銷書作家最新著作《卡哇伊造型蛋黃酥》出版日期：2022/8/9榮獲期：2021/7/1榮《卡哇8/9榮獲momo暢銷書榜第1名!!最新著作《卡哇伊造型鳳梨酥》出版日期：2021/7/1榮獲博客來全館即時榜第1名!!榮獲博客來中文飲食類新書暢銷榜第1名!!2021博客來年度百大暢銷榜第75名!! 著作《卡哇伊節日&活動造型饅頭》出版日期：2021/4/1 榮獲博客來中文飲食類新書暢銷榜第2名!!著作《卡哇伊一口小饅頭》出版日期：2019/11/5 榮獲博客來全館即時榜第1名!!',
	};

	return (
		<>
			<Header />
			<div className={`${TeacherStyles.teacherDetail} container-fluid py-5`}>		<div className={`${TeacherStyles.btn}`}>
						<Link href="/teacher" passHref>
							<SquareButton
								bgColor="#ffa08f"
								color="white"
								size="20px"
								value="返回教師列表"
							/>
						</Link>
					</div>
				{/* Section 1: 老師圖片 */}
				<div
					className={`${TeacherStyles.section1} justify-content-center align-items-center`}
				>
			
					<div className={`${TeacherStyles.imageBox} ZRT-center`}>
						<img
							src={teacher.imgSrc}
							alt={teacher.name}
							className="img-fluid rounded"
						/>
					</div>
				</div>

				{/* Section 2: 老師的文字資訊 */}
				<div
					className={`${TeacherStyles.section2} container-fluid justify-content-center align-items-center`}
				>
					<div
						className={`${TeacherStyles.textBox} container-fluid d-flex justify-content-center align-items-stretch pt-4`}
					>
						<div className="col-sm-6 col-md-4 col-lg-3 px-4 text-left d-flex flex-column">
							<h2>{teacher.name}</h2>
							<p>{teacher.description}</p>
						</div>
						<div className="col-sm-6 col-md-4 col-lg-3 px-4 text-left d-flex flex-column">
							<p>{teacher.experience}</p>
						</div>
						<div className="col-sm-6 col-md-4 col-lg-3 px-4 text-left d-flex flex-column">
							<p>{teacher.award}</p>
						</div>
						<div className="col-sm-6 col-md-4 col-lg-3 px-4 text-left d-flex flex-column">
							<p>{teacher.edu}</p>
						</div>
					</div>

					{/* Section 3: 其他老師卡片 */}
					<div className="container py-5 otherBox">
						<h3 className="text-center mb-4">其他老師</h3>
						<div className="row">
							{otherTeachers.map((teacher) => (
								<div
									className="col-sm-6 col-md-4 col-lg-3 mb-4 ZRT-center"
									key={teacher.id}
								>
									<TeacherCard teacher={teacher} />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
}
