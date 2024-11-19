import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import StepBar from '@/components/cart/step-bar';
import { useUser } from '@/context/userContext';
import { useRouter } from 'next/router';
import { useCart } from '@/context/cartContext';
import axios from 'axios';

export default function CheckoutDone(props) {
	const router = useRouter();
	const { transactionId } = router.query;
	const { orders } = router.query;
	const { user } = useUser();
	const { cart, handleCart } = useCart();
	const [finishOrder, setFinishOrder] = useState(false);

	console.log('交易號碼', transactionId);
	useEffect(() => {
		// 檢查登入狀態,不正確則立即導頁
		console.log('查驗程式執行順序');
		if (user) {
			cart.length > 0 && setFinishOrder(true);
		} else {
			router.push('/login');
		}
	}, []);

	useEffect(() => {
		//確定結帳完成則把結帳的部分清空
		if (finishOrder) {
			handleCart(cart, '_', 'afterBuyClear');
			console.log('清空購物車有正常執行');
		}
	}, [finishOrder]);

	useEffect(() => {
		//line Pay的情況
		if (transactionId != undefined) {
			axios
				.get(
					`http://localhost:3005/api/line-pay/confirm-product?transactionId=${transactionId}`
				)
				.then((res) => console.log('交易成功'))
				.catch((error) => console.error('交易失敗', error));
		}

		//ecPay的情況
		if (orders != undefined) {
			const orderAry = orders.split('-');

			(async () => {
				try {
					const promises = orderAry.map(
						(order) => axios.get(`http://localhost:3005/api/cart/ecpay-finished/${order}`) // 假設的 API 路徑
					);

					const responses = await Promise.all(promises);
					responses.forEach((response, index) => {
						console.log(`Order ${orderAry[index]} processed:`, response.data);
					});
				} catch (error) {
					console.error('Error processing orders:', error);
				}
			})();
		}
	}, [transactionId, orders]);

	return (
		<>
			<Header />
			<section>
				<main>
					<StepBar />
					<div className="container text-center mt-5 fw-bolder mb-5">
						<h1 className="">您的訂單已送出!</h1>
						{/* <h3 className="">訂單編號</h3> */}
						<a
							href="/user/purchase"
							className="ZRT-btn btn-lpnk mt-3 ZRT-click ZRT-btn-rounded ZRT-ls-1"
						>
							前往歷史訂單
						</a>
					</div>
				</main>
			</section>
			<Footer />

			<style jsx>
				{`
					section {
						min-height: calc(100vh - 190px);
						width: 100%;
					}

					main {
						padding-top: 150px;
						max-width: 1200px;
						margin-inline: auto;
					}
				`}
			</style>
		</>
	);
}
