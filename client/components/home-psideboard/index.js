import React, { useState, useEffect } from 'react';
import sty from './home-psideboard.module.scss';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';

export default function HomeSideBoard({
	type = '元件請傳入type參數',
	src = '元件請傳入圖片',
	sideboard = false,
	setSideBoard = (f) => {},
}) {
	return (
		<>
			<div className={`${sty['board']} ${sideboard ? '' : 'board-close'}`}>
				<div className={`${sty['frameArea']}`}>
					<div className={`${sty['frame']}`}>
						<Image src={src} width={0} height={0} alt={src} />
					</div>
					<div className={`${sty['type']} rounded-pill`}>{type}</div>
				</div>
				<div className={`${sty['textArea']}`}>
					<div className={`${sty['text']}`}>精選商品</div>
					<div className={`${sty['text']}`}>
						Le salé nous nourrit, le sucré nous réjouit
					</div>
				</div>
				<div className={`${sty['ProductArea']}`}></div>
				<div
					className={`${sty['backButton']} ZRT-click`}
					onClick={() => {
						setSideBoard(!sideboard);
					}}
				>
					<FaArrowRight />
				</div>
			</div>

			<style jsx>
				{`
					.board-close {
						translate: 50vw;
					}

					@media (max-width: 992px) {
						.board-close {
							translate: 80vw;
						}
					}

					@media (max-width: 768px) {
						.board-close {
							translate: 100vw;
						}
					}
				`}
			</style>
		</>
	);
}