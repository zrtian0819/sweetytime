import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { FaPen, FaEye, FaTrashAlt } from 'react-icons/fa';
import Pagination from '@/components/pagination';
import styles from '@/styles/adminLesson.module.scss';

export default function Lessons(props) {
	return (
		<>
			<AdminLayout>
				<table class={`${styles['CTH-table']} table table-hover`}>
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
						<tr class="text-center m-auto align-middle">
							<td>1</td>
							<td>上架中</td>
							<td>蒙布朗栗子巧克力蛋糕</td>
							<td>蛋糕</td>
							<td>劉偉苓 Willin</td>
							<td>2024-08-22 09:00</td>
							<td>40</td>
							<td>1</td>
							<td>
								<Link href={'./viewLesson'} className={styles['CTH-link']}>
									<FaEye size={18} />
								</Link>
								<Link href={'./editLesson'} className={styles['CTH-link']}>
									<FaPen size={18} />
								</Link>
								<Link href={'#'} className={styles['CTH-link']}>
									<FaTrashAlt size={18} />
								</Link>
							</td>
						</tr>
					</tbody>
				</table>
				<Pagination
					currentPage={1}
					totalPages={5}
					onPageChange={() => {}}
					changeColor="#fe6f67"
				/>
			</AdminLayout>
		</>
	);
}
