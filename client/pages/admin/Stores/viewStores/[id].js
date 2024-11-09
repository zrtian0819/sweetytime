import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Link from 'next/link';
import Styles from '@/styles/adminShop.module.scss';
import ExpandButton from '@/components/button/expand-button';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ViewStores() {
	const router = useRouter();
	const { id } = router.query;
	const [data, setData] = useState(null);

	useEffect(() => {
		if (id) {
			axios
				.get(`http://localhost:3005/api/shop/${id}`)
				.then((res) => setData(res.data))
				.catch((error) => console.error('Error fetching data:', error));
		}
	}, [id]);

	return (
		<>
			<AdminLayout>
				<div className="container my-3">
					<div className="d-flex flex-row gap-3">
						<Link href="../">
							<ExpandButton value="返回列表頁" />
						</Link>
					</div>
					<div className="row">
						{data ? (
							<>
								<div className="d-flex flex-column">
									<div className="text-center mb-2">
										<Image
											src={`/photos/shop_logo/${data.logo_path}`}
											width={300}
											height={300}
											style={{ objectFit: 'contain' }}
											className="m-auto"
										/>
										<h2 className={`${Styles['TIL-text']} text-center`}>
											{data.name}
										</h2>
									</div>
									<div className={`${Styles['TIL-table']} container`}>
										<div className="row">
											<div className={`${Styles['TIL-header']}`}>
												<div className={Styles['TIL-Box']}>
													<h4 className={Styles['table-cell']}>電話：</h4>
													<p className={Styles['table-cell']}>
														{data.phone}
													</p>
												</div>
												<div className={Styles['TIL-Box']}>
													<h4 className={Styles['table-cell']}>地址：</h4>
													<p className={Styles['table-cell']}>
														{data.address}
													</p>
												</div>
												<div className={Styles['TIL-Box']}>
													<h4 className={Styles['table-cell']}>簡介：</h4>
													<p className={Styles['table-cell']}>
														{data.description || '無'}
													</p>
												</div>
												<div className={Styles['TIL-Box']}>
													<h4 className={Styles['table-cell']}>狀態：</h4>
													<p
														className={Styles['table-cell']}
														style={{ color: 'red' }}
													>
														{data.activation ? '啟用中' : '停用中'}
													</p>
												</div>
												<div className={Styles['TIL-Box']}>
													<h4 className={Styles['table-cell']}>
														註冊時間：
													</h4>
													<p className={Styles['table-cell']}>
														{data.sign_up_time}
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
								<Link
									href={`/admin/Stores/editStores/${id}`}
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
						) : (
							<p>正在加載店家資料...</p>
						)}
					</div>
				</div>
			</AdminLayout>
		</>
	);
}
