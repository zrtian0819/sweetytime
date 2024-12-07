import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Link from 'next/link';
import Styles from '@/styles/adminShop.module.scss';
import ExpandButton from '@/components/button/expand-button';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useUser } from '@/context/userContext';

export default function ViewStores() {
	const { user, logout } = useUser();
	const router = useRouter();
	const { id } = router.query;
	const [data, setData] = useState();

	useEffect(() => {
		if (user) {
			axios
				.get(
					user.role === 'admin'
						? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shop/${id}`
						: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shopBackstage-order/${user.id}`
				)
				.then((res) => {
					setData(res.data);
				})
				.catch((error) => {
					console.error('Error fetching data:', error);
				});
		}
	}, [user]);

	return (
		<>
			<AdminLayout style={{ position: 'relative' }}>
				<div
					className="container"
					style={{ overflowY: 'auto', height: '100%', scrollbarWidth: '15px' }}
				>
					{user?.role === 'admin' && (
						<Link href="../">
							<ExpandButton value="返回列表頁" />
						</Link>
					)}
					<div className="row">
						{data ? (
							<>
								<div className="d-flex flex-column">
									<div className="text-center mb-2 d-flex flex-column gap-3">
										<Image
											src={`/photos/shop_logo/${data.logo_path}`}
											width={250}
											height={250}
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
													<p
														className={Styles['table-cell']}
														dangerouslySetInnerHTML={{
															__html: data.description,
														}}
													></p>
												</div>
												{user.role === 'admin' ? (
													<div className={Styles['TIL-Box']}>
														<h4 className={Styles['table-cell']}>
															狀態：
														</h4>
														<p
															className={Styles['table-cell']}
															style={{
																color: data.activation
																	? 'green'
																	: 'red',
															}}
														>
															{data.activation ? '啟用中' : '停用中'}
														</p>
													</div>
												) : (
													''
												)}
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
