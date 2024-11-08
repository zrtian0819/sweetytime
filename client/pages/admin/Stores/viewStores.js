import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/adminShop.module.scss';
import ExpandButton from '@/components/button/expand-button';
import { Button } from '@mui/material';

export default function ViewStores({
	name = '艾波索',
	phone = '0909',
	logo_path = '/photos/shop_logo/Aposo_logo.png',
}) {
	return (
		<>
			<AdminLayout>
				<div className="container my-3">
					<div className="d-flex flex-row gap-3">
						<Link href="./">
							<ExpandButton value="返回列表頁" />
						</Link>
						<h1 className={styles['TIL-text']}>店家基本資料</h1>
					</div>
					<div className="row">
						<div className="d-flex flex-column">
							<div className="text-center mb-5">
								<Image
									src={logo_path}
									width={300}
									height={300}
									style={{ objectFit: 'contain' }}
									className="m-auto"
								/>
								<h2 className={`${styles['TIL-text']} text-center`}>{name}</h2>
							</div>
							<table className={`${styles['TIL-table']} table table-hover`}>
								<tbody>
									<tr>
										<th>
											<h4>電話：</h4>
										</th>
										<td>{phone}</td>
									</tr>

									<tr>
										<th>
											<h4>地址：</h4>
										</th>
										<td>2024-08-22 09:00:00</td>
									</tr>
									<tr>
										<th>
											<h4>簡介：</h4>
										</th>
										<td>40</td>
									</tr>
									<tr>
										<th>
											<h4>狀態：</h4>
										</th>
										<td>啟用中</td>
									</tr>
									<tr>
										<th>
											<h4>註冊時間：</h4>
										</th>
										<td>2,800</td>
									</tr>
								</tbody>
							</table>
						</div>

						<Link href={'./editStores'} className="ms-auto col-auto">
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
