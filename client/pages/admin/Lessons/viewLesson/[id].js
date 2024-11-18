import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Link from 'next/link';
import ReturnBtn from '@/components/button/expand-button';
import styles from '@/styles/adminLesson.module.scss';
import Swal from 'sweetalert2';
import { Button, Box } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ViewLesson(props) {
	const router = useRouter();
	const { id } = router.query;
	const [data, setData] = useState([]);
	const [stu, setStu] = useState([]);
	const [lesson, setLesson] = useState();
	const [photo, setPhoto] = useState([]);
	const [teacher, setTeacher] = useState([]);
	const [type, setType] = useState([]);

	useEffect(() => {
		axios
			.get(`http://localhost:3005/api/lesson/${id}`)
			.then((res) => {
				setData(res.data);
				setLesson(res.data.lesson);
				setPhoto(res.data.photo);
				setTeacher(res.data.teacher);
				setType(res.data.type);
				setStu(res.data.stu);
			})
			.catch((error) => console.error('拿不到資料', error));
	}, [id]);
	console.log(photo);
	const cantEdit = () => {
		Swal.fire({
			icon: 'warning',
			title: '此老師目前已下架',
			text: '請至師資頁編輯',
			confirmButtonText: 'OK',
			confirmButtonColor: '#fe6f67',
		});
	};
	return (
		<>
			{data.lesson ? (
				<>
					<AdminLayout>
						{data.lesson.length > 0 ? (
							<>
								<div className={`${styles['CTH-overflow']} container`}>
									<Box>
										<Link href="/admin/Lessons" passHref>
											<ReturnBtn value="返回課程列表" />
										</Link>
									</Box>
									<h1 className={styles['CTH-h1']}>{lesson[0].name}</h1>
									<div className="row">
										<div className="d-flex flex-column col-4">
											<Image
												src={`/photos/lesson/${lesson[0].img_path}`}
												width={300}
												height={300}
												style={{ objectFit: 'cover', borderRadius: '25px' }}
												className="m-auto"
											/>
											<div className="">
												{photo.map((photo) => {
													return (
														<Image
															src={`/photos/lesson/${photo.file_name}`}
															width={100}
															height={100}
															style={{
																objectFit: 'cover',
																borderRadius: '25px',
															}}
															className="mt-2 me-2"
														/>
													);
												})}
											</div>
											<table
												className={`${styles['CTH-table']} table table-hover`}
											>
												<tbody>
													<tr>
														<th>
															<h5>分類</h5>
														</th>
														<td>{type[0].class_name}</td>
													</tr>
													<tr>
														<th>
															<h5>講師</h5>
														</th>
														<td>{teacher[0].name}</td>
													</tr>
													<tr>
														<th>
															<h5>價錢</h5>
														</th>
														<td class="text-danger">
															NTD{' '}
															{new Intl.NumberFormat().format(
																lesson[0].price
															)}
														</td>
													</tr>
													<tr>
														<th>
															<h5>時間</h5>
														</th>
														<td>{lesson[0].start_date}</td>
													</tr>
													<tr>
														<th>
															<h5>課程人數</h5>
														</th>
														<td>{lesson[0].quota}</td>
													</tr>
													<tr>
														<th>
															<h5>報名人數</h5>
														</th>
														<td>{stu.length}</td>
													</tr>
													<tr>
														<th>
															<h5>地點</h5>
														</th>
														<td>{lesson[0].classroom_name}</td>
													</tr>
													<tr>
														<th>
															<h5>地址</h5>
														</th>
														<td>{lesson[0].location}</td>
													</tr>
													<tr>
														<th>
															<h5>狀態</h5>
														</th>
														<td>
															{lesson[0].activation == 0 ||
															teacher[0].activation == 0
																? '已下架'
																: '上架中'}
														</td>
													</tr>
												</tbody>
											</table>
										</div>
										<div className={`${styles['CTH-class-info']} col-8`}>
											<h2>課程介紹</h2>
											<div
												dangerouslySetInnerHTML={{
													__html: lesson[0].description,
												}}
											></div>
										</div>

										{teacher[0].activation == 0 ? (
											<>
												<Button
													variant="contained"
													className="ms-auto col-2"
													onClick={cantEdit}
													sx={{
														color: '#FFF',
														background: '#fe6f67',
														marginRight: '8px',
													}}
												>
													無法編輯
												</Button>
											</>
										) : (
											<>
												<Link
													href={`../editLesson/${id}`}
													className="ms-auto col-auto"
												>
													<Button
														variant="contained"
														className="ms-auto col-1"
														sx={{
															color: '#FFF',
															background: '#fe6f67',
															marginRight: '8px',
														}}
													>
														編輯
													</Button>
												</Link>
											</>
										)}
									</div>
								</div>
							</>
						) : (
							''
						)}
					</AdminLayout>
				</>
			) : (
				''
			)}
		</>
	);
}
