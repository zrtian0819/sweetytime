import React, { useState, useEffect } from 'react';
//loader來源: https://blog.hubspot.com/website/css-loading-animation

export default function LoaderThreeDots(props) {
	return (
		<>
			<div className="loader-container">
				<div className="bouncing-dots">
					<div className="dot" />
					<div className="dot" />
					<div className="dot" />
				</div>
			</div>

			<style jsx>
				{`
					.loader-container {
						display: flex;
						justify-content: center;
						align-items: center;
						height: 20vh;
					}

					.bouncing-dots {
						display: flex;
						justify-content: space-between;
						width: 60px;
					}

					.dot {
						width: 15px;
						height: 15px;
						background-color: #ff5c35;
						border-radius: 50%;
						animation: bounce 1.5s infinite;
					}

					.dot:nth-child(1) {
						animation-delay: 0s;
					}

					.dot:nth-child(2) {
						animation-delay: 0.3s;
					}

					.dot:nth-child(3) {
						animation-delay: 0.6s;
					}

					@keyframes bounce {
						0%,
						100% {
							transform: translateY(0);
						}
						50% {
							transform: translateY(-20px);
						}
					}
				`}
			</style>
		</>
	);
}