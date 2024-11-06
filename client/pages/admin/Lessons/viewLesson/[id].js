import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/adminLesson.module.scss';
import { Button } from '@mui/material';

import { useRouter } from 'next/router';
import axios from 'axios';
import { number } from 'prop-types';

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
	return (
		<>
			{data.lesson ? (
				<>
					<AdminLayout>
						{data.lesson.length > 0 ? (
							<>
								<h1 className={styles['CTH-h1']}>{lesson[0].name}</h1>
								<div className="container">
									<div className="row">
										<div className="d-flex flex-column col-4">
											<Image
												src={`/photos/lesson/${lesson[0].img_path}`}
												width={300}
												height={300}
												style={{ objectFit: 'cover' }}
												className="m-auto"
											/>
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
															{lesson[0].activation == 1
																? '上架中'
																: '已下架'}
														</td>
													</tr>
												</tbody>
											</table>
										</div>
										<div className={`${styles['CTH-class-info']} col-8`}>
											<h2>課程介紹</h2>
											<div>{lesson[0].description}</div>
										</div>
										<Link href={'../editLesson'} className="ms-auto col-auto">
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
