import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/cart.module.scss';
import StepBar from '@/components/cart/step-bar';
import Link from 'next/link';
import CheckoutItem from '@/components/cart/checkout-item';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useUser } from '@/context/userContext';

export default function LessonCheckout(props) {
	const router = useRouter();
	const { id } = router.query;
	const [lesson, setLesson] = useState([]);
	const [stu, setStu] = useState([]);
	const { user } = useUser();

	const [payway, setPayWay] = useState('');

	const handlePayWay = (event) => {
		setPayWay(event.target.value);
	};

	useEffect(() => {
		axios
			.get(`http://localhost:3005/api/lesson/${id}`)
			.then((response) => {
				setLesson(response.data.lesson);
			})
			.catch((error) => console.error('拿不到資料', error));
	}, [id]);
	useEffect(() => {
		// 請求 student 表數據
		axios
			.get(`http://localhost:3005/api/lesson/student/${id}`)
			.then((response) => setStu(response.data))
			.catch((error) => console.error('Error fetching users:', error));
	}, [id]);

	const submit = () => {
		switch (payway) {
			case 'credit':
				console.log('信用卡付款');
				break;
			case 'linepay':
				axios
					.post(`http://localhost:3005/api/line-pay/create-order`, payData)
					.then((res) => {
						const orderId = res.data.dataOrder.order.orderId;
						console.log(orderId);
						router.push(
							`http://localhost:3005/api/line-pay/reserve?orderId=${orderId}`
						);
					})
					.catch((error) => {
						console.error('失敗', error);
					});
				break;
			case 'ecpay':
				axios
					.post(`http://localhost:3005/api/cart/create-order-lesson`, ecData)
					.then((res) => {
						try {
							const url = new URL('http://localhost:3005/api/ecpay-test-only');
							url.searchParams.append('amount', data.price);
							window.location.href = url.toString();
						} catch (error) {
							console.error('綠界支付導向失敗:', error);
							toast.error('支付導向失敗，請稍後再試');
							throw new Error('綠界支付導向失敗');
						}
					})
					.catch((error) => {
						console.error('失敗', error);
					});

				break;
		}
	};
	const data = lesson[0];
	console.log(data);
	console.log(payway);

	const payData = data
		? {
				amount: parseInt(data.price),
				products: [
					{
						id: data.id,
						name: data.name,
						price: parseInt(data.price),
						time: getCurrentTime(),
					},
				],
		  }
		: {};
	const ecData = data
		? {
				user_id: user.id,
				lesson_id: data.id,
				sign_up: getCurrentTime(),
		  }
		: {};

	function getCurrentTime() {
		const now = new Date();

		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份從0開始，需+1
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}

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
												quota={data.quota - stu[0].student_count}
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
												<input
													type="radio"
													name="pay"
													className="me-2"
													value="credit"
													onClick={handlePayWay}
												/>
												信用卡
											</label>
											<label className="d-block mb-1">
												<input
													type="radio"
													name="pay"
													className="me-2"
													value="linepay"
													onClick={handlePayWay}
												/>
												LINE PAY
											</label>
											<label className="d-block mb-1">
												<input
													type="radio"
													name="pay"
													className="me-2"
													value="ecpay"
													onClick={handlePayWay}
												/>
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
											<Button
												className="ZRT-btn btn-lpnk w-100 mt-3 d-flex justify-content-center align-items-center ZRT-click"
												onClick={submit}
											>
												確認報名
											</Button>
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
