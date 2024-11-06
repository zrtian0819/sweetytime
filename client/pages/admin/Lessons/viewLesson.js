import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/adminLesson.module.scss';
import { Button } from '@mui/material';

export default function ViewLesson(props) {
	return (
		<>
			<AdminLayout>
				<h1 className={styles['CTH-h1']}>蒙布朗栗子蛋糕</h1>
				<div className="container">
					<div className="row">
						<div className="d-flex flex-column col-4">
							<Image
								src={'/photos/lesson/28_cake_nuts.jpg'}
								width={300}
								height={300}
								style={{ objectFit: 'cover' }}
								className="m-auto"
							/>
							<table className={`${styles['CTH-table']} table table-hover`}>
								<tbody>
									<tr>
										<th>
											<h5>分類</h5>
										</th>
										<td>蛋糕</td>
									</tr>
									<tr>
										<th>
											<h5>講師</h5>
										</th>
										<td>劉偉苓 Willin</td>
									</tr>
									<tr>
										<th>
											<h5>價錢</h5>
										</th>
										<td class="text-danger">2,800</td>
									</tr>
									<tr>
										<th>
											<h5>時間</h5>
										</th>
										<td>2024-08-22 09:00:00</td>
									</tr>
									<tr>
										<th>
											<h5>課程人數</h5>
										</th>
										<td>40</td>
									</tr>
									<tr>
										<th>
											<h5>報名人數</h5>
										</th>
										<td>1</td>
									</tr>
									<tr>
										<th>
											<h5>地點</h5>
										</th>
										<td>A CAKE A DAY圓夢烘焙教室</td>
									</tr>
									<tr>
										<th>
											<h5>地址</h5>
										</th>
										<td>苗栗縣苗栗市博愛街112號</td>
									</tr>
									<tr>
										<th>
											<h5>狀態</h5>
										</th>
										<td>上架中</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className={`${styles['CTH-class-info']} col-8`}>
							<h2>課程介紹</h2>
							<div>內容</div>
						</div>
						<Link href={'./editLesson'} className="ms-auto col-auto">
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
			</AdminLayout>
		</>
	);
}
