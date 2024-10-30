import React, { useState, useEffect } from 'react';
import sty from './homeTeacher.module.scss';
import Image from 'next/image';
import Link from 'next/link';

export default function HomeTeacher({
	name = '隱姓埋名',
	title = '甜點頭銜',
	src = '',
	link = '',
}) {
	return (
		<Link href={link} className={`${sty['homeTCard']} ZRT-click `}>
			<div className={`${sty['tText']} ZRT-hollow-text`}>{title}</div>
			<div className={`${sty['tText']} ZRT-hollow-text`}>{name}</div>
			<div className={`${sty['picBox']}`}>
				<Image src={src} width={0} height={0} alt="" />
			</div>
		</Link>
	);
}
