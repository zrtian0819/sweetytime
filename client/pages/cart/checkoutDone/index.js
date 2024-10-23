import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import StepBar from '@/components/cart/step-bar';

export default function CheckoutDone(props) {
	return (
		<>
			<Header />
			<section>
				<main>
					<StepBar />
					<div className="container text-center mt-5 fw-bolder">
						<h1 className="">您的訂單已送出!</h1>
						<h3 className="">訂單編號</h3>
						<a href="" className="ZRT-btn btn-lpnk mt-3 ZRT-click">前往歷史訂單</a>
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
                        max-width:1200px;
                        margin-inline:auto;
					}
				`}
			</style>
		</>
	);
}
