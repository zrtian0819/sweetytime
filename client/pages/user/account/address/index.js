import React from 'react';
import Img from 'next/image';

import Header from '@/components/header';
import Footer from '@/components/footer';
import UserLeft from '@/components/user-left';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Styles from '@/styles/user.module.scss';

export default function Profile() {
	const MenuItem = ({ icon, text }) => (
		<a
			href="#"
			className="flex items-center px-8 py-3 text-gray-600 hover:bg-white/30 transition-colors"
		>
			<i className={`fas ${icon} text-red-400 mr-3`}></i>
			{text}
		</a>
	);
	return (
		<>
			<Header />
			<div className={`${Styles['TIL-body']} mt-5 d-none d-md-flex flex-column container`}>
				<div className={`${Styles['TIL-userbody']}`}>
					<UserLeft />
					<div className={`${Styles['TIL-user-right']}`}></div>
                </div>
            </div>
        </>
    );
}
