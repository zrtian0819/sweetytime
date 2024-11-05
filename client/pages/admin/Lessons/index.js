import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import Pagination from '@/components/pagination';
import ViewButton from '@/components/adminCRUD/viewButton';
import EditButton from '@/components/adminCRUD/editButton';
import ToggleButton from '@/components/adminCRUD/toggleButton';
import styles from '@/styles/adminLesson.module.scss';

export default function Lessons(props) {
	const [isToggled, setIsToggled] = useState(false);
	const handleToggleClick = () => {
		setIsToggled(!isToggled);
		console.log('Toggle狀態:', isToggled ? '關閉' : '開啟');
	};
	return (
		<>
			<AdminLayout>
				<table className={`${styles['CTH-table']} table table-hover`}>
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
								<div className="d-flex gap-3 justify-content-center">
									<Link href={'./Lessons/viewLesson'}>
										<ViewButton />
									</Link>
									<Link href={'./Lessons/editLesson'}>
										<EditButton />
									</Link>
									<ToggleButton
										onClick={handleToggleClick}
										isActive={isToggled}
									/>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				<Pagination
					currentPage={1}
					totalPages={5}
					onPageChange={() => {}}
					changeColor="#fff"
				/>
			</AdminLayout>
		</>
	);
}
