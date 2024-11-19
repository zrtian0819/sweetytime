import React, { useState, useEffect } from 'react';
import sty from './pikaso.module.scss'; //引入style
import Image from 'next/image';

export default function Pikaso({
	text = 'text',
	src = '/photos/pikaso/Pikaso1.png',
	bgc = '',
	title = 'title',
}) {
	if (!bgc) bgc = 'linear-gradient(175deg, rgba(255,198,195,1) 0%, rgba(254,111,103,1) 100%)';

	if (bgc == '1') {
		bgc = 'linear-gradient(175deg, rgba(255,198,195,1) 0%, rgba(254,111,103,1) 100%)';
	} else if (bgc == '2') {
		bgc = 'linear-gradient(to right, #967AC6, #FCCFD6)';
	} else if (bgc == '3') {
		bgc =
			'linear-gradient(54deg, rgba(193,222,252,1) 0%, rgba(247,149,149,1) 49%, rgba(255,218,140,1) 100%)';
	} else if (bgc == '4') {
		bgc = 'linear-gradient(15deg, rgba(184,178,254,1) 7%, rgba(148,255,241,1) 95%)';
	}

	return (
		<>
			<div className={`${sty.outter}`}>
				<div className={`${sty.box} ZRT-pikaso-box`}>
					<Image src={src} width={10} height={10} alt="" />
				</div>

				<div className={`${sty.text}`}>
					<div className={`${sty.wrapper}`}>
						<div className={`${sty.glass}`}></div>
						<h2>{title}</h2>
						<p>{text}</p>
					</div>
				</div>
			</div>

			<style jsx>
				{`
					.ZRT-pikaso-box {
						background: ${bgc};
					}
				`}
			</style>
		</>
	);
}
