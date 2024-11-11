import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/cart.module.scss';
import StepBar from '@/components/cart/step-bar';
import Link from 'next/link';
import CheckoutItem from '@/components/cart/checkout-item';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function LessonCheckout(props) {
	const router = useRouter();
	const { id } = router.query;
	const [lesson, setLesson] = useState([]);

	useEffect(() => {
		axios
			.get(`http://localhost:3005/api/lesson/${id}`)
			.then((response) => {
				setLesson(response.data.lesson);
			})
			.catch((error) => console.error('拿不到資料', error));
	}, [id]);
	const data = lesson[0];
	console.log(data);
	return (
		<>
			<Header />
			<div className={`${Styles['ZRT-cartBody']}`}>
				<h2 className={`${Styles['ZRT-pageTitle']} col mb-4 text-center`}>課程報名</h2>
				<div className="container-md d-flex justify-content-start align-items-center flex-column">
					{data ? (
						<>
							<div className="d-flex flex-column w-100 mt-4">
								<div className={`${Styles['ZRT-checkoutArea']} container px-3`}>
									<div className="row">
										<div className="col-12  d-flex flex-column">
											<CheckoutItem
												type="lesson"
												src={`/photos/lesson/${data.img_path}`}
												name={data.name}
												date={data.start_date}
												classroom={data.classroom_name}
												location={data.location}
												price={data.price}
												quota={data.quota}
											/>

											<hr />
											<div className="d-flex justify-content-end mb-2 pe-2 text-danger">
												<h3>小計 NT${data.price}</h3>
											</div>
										</div>
									</div>
								</div>

								<div className="container">
									<div className="row">
										<div className="col-12 col-lg-8 p-4">
											<h3 className="fw-bold">付款方式</h3>
											<label className="d-block mb-1">
												<input type="radio" name="pay" className="me-2" />
												信用卡
											</label>
											<label className="d-block mb-1">
												<input type="radio" name="pay" className="me-2" />
												LINE PAY
											</label>
											<label className="d-block mb-1">
												<input type="radio" name="pay" className="me-2" />
												綠界科技
											</label>
											<label className="d-block mb-1">
												<input type="radio" name="pay" className="me-2" />
												藍新科技
											</label>
										</div>
										<div className="col-12 col-lg-4 p-4">
											<div className="fw-bolder">
												總金額 NT${' '}
												<span className="text-danger">{data.price}</span>
											</div>
											<Link
												className="ZRT-btn btn-lpnk w-100 mt-3 d-flex justify-content-center align-items-center ZRT-click"
												href="/cart/checkoutDone"
											>
												確認報名
											</Link>
										</div>
									</div>
								</div>
							</div>
						</>
					) : (
						'載入中'
					)}
				</div>
			</div>
			<Footer />
		</>
	);
}
