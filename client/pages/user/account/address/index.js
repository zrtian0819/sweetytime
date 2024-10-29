import React, { useState } from 'react';
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
import { Checkbox } from '@mui/material';
import { FaPen } from 'react-icons/fa';

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
	const [edit, setEdit] = useState([false, false, false]);
	const handleEdit = (index) => {
		const newEdit = edit.map((isEdit, i) => (i === index ? !isEdit : isEdit));
		setEdit(newEdit);
	};

	const [check, setCheck] = useState([false, false, false]);
	const handleCheck = (index) => {
		const newCheck = check.map((isCheck, i) => (i === index ? !isCheck : isCheck));
		setCheck(newCheck);
	};

	return (
		<>
			<Header />
			<div className={`${Styles['TIL-body']} mt-5 d-none d-md-flex flex-column container`}>
				<div className={`${Styles['TIL-userbody']}`}>
					<UserLeft />
					<div className={`${Styles['TIL-user-right']}`}>
						<ul>
							<li>
								<div className="d-flex align-items-start gap-3">
									<Img
										src={'/icon/address.svg'}
										width={30}
										height={50}
										className="align-self-center"
									/>
									<div>
										<h3>收件人</h3>
										{edit[0] ? (
											<>
												<input
													type="text"
													placeholder="姓名"
													className="mb-2"
												/>
												<br />
												<input type="text" placeholder="地址" />
											</>
										) : (
											<>
												<div>蔡依琳</div>
												<div>台北市信義區松江南路</div>
											</>
										)}
									</div>
								</div>
								<div className="d-flex ps-1">
									<FormControlLabel
										control={
											<Checkbox
												checked={check[0]}
												onChange={() => {
													handleCheck(0);
												}}
												sx={{
													color: '#fe6f67',
													borderRadius: '25px',
													'&.Mui-checked': {
														color: '#fe6f67',
													},
												}}
											/>
										}
										label={check[0] ? '預設地址' : '設為預設地址'}
									/>

									<Button
										variant="contained"
										sx={{
											color: '#FFF',
											background: '#747474',
										}}
										className="ms-auto"
										onClick={() => {
											handleEdit(0);
										}}
									>
										{edit[0] ? '完成' : '編輯'}
									</Button>
								</div>
							</li>
							<hr />
							<li>
								<div className="d-flex align-items-start gap-3">
									<Img
										src={'/icon/address.svg'}
										width={30}
										height={50}
										className="align-self-center"
									/>
									<div>
										<h3>收件人</h3>
										{edit[1] ? (
											<>
												<input
													type="text"
													placeholder="姓名"
													className="mb-2"
												/>
												<br />
												<input type="text" placeholder="地址" />
											</>
										) : (
											<>
												<div>蔡依琳</div>
												<div>台北市信義區松江南路</div>
											</>
										)}
									</div>
								</div>
								<div className="d-flex ps-1">
									<FormControlLabel
										control={
											<Checkbox
												checked={check[1]}
												onChange={() => {
													handleCheck(1);
												}}
												sx={{
													color: '#fe6f67',
													borderRadius: '25px',
													'&.Mui-checked': {
														color: '#fe6f67',
													},
												}}
											/>
										}
										label={check[1] ? '預設地址' : '設為預設地址'}
									/>

									<Button
										variant="contained"
										sx={{
											color: '#FFF',
											background: '#747474',
										}}
										className="ms-auto"
										onClick={() => {
											handleEdit(1);
										}}
									>
										{edit[1] ? '完成' : '編輯'}
									</Button>
								</div>
							</li>
							<hr />
							<li>
								<div className="d-flex align-items-start gap-3">
									<Img
										src={'/icon/address.svg'}
										width={30}
										height={50}
										className="align-self-center"
									/>
									<div>
										<h3>收件人</h3>
										{edit[2] ? (
											<>
												<input
													type="text"
													placeholder="姓名"
													className="mb-2"
												/>
												<br />
												<input type="text" placeholder="地址" />
											</>
										) : (
											<>
												<div>蔡依琳</div>
												<div>台北市信義區松江南路</div>
											</>
										)}
									</div>
								</div>
								<div className="d-flex ps-1">
									<FormControlLabel
										control={
											<Checkbox
												checked={check[2]}
												onChange={() => {
													handleCheck(2);
												}}
												sx={{
													color: '#fe6f67',
													borderRadius: '25px',
													'&.Mui-checked': {
														color: '#fe6f67',
													},
												}}
											/>
										}
										label={check[2] ? '預設地址' : '設為預設地址'}
									/>

									<Button
										variant="contained"
										sx={{
											color: '#FFF',
											background: '#747474',
										}}
										className="ms-auto"
										onClick={() => {
											handleEdit(2);
										}}
									>
										{edit[2] ? '完成' : '編輯'}
									</Button>
								</div>
							</li>
							<hr />
						</ul>
					</div>
				</div>
			</div>
			<div className={`${Styles['TIL-body-mb']} mt-5 d-flex d-md-none flex-column `}>
				<div className="container">
					<div className={Styles['CTH-user-header']}>
						<div className={`${Styles['TIL-user-left-menu-picHead']}`}>
							<Img
								src="/photos/users/user_panda.png"
								alt="頭像"
								width={100}
								height={100}
								className="rounded-circle object-fit-cover shadow-sm"
							/>
						</div>
						<div className={`${Styles['CTH-header-right']} text-center ms-2`}>
							<h1 className="mb-3">AiBao_baoFamily0524</h1>
							<button
								className={`${Styles['CTH-btn']} d-flex align-items-center m-auto`}
							>
								<div className="me-2">管理個人資料</div>
								<FaPen />
							</button>
						</div>
					</div>
				</div>
				<div className={`${Styles['CTH-nav-zone']} d-flex d-md-none`}>
					<UserLeft />
				</div>
				<div className={Styles['CTH-section']}>
					<h2>地址管理</h2>
				</div>
				<div className={`${Styles['TIL-user-right-mb']}`}>
					<ul>
						<li>
							<div className="d-flex align-items-start gap-3">
								<Img
									src={'/icon/address.svg'}
									width={30}
									height={50}
									className="align-self-center"
								/>
								<div>
									<h3>收件人</h3>
									{edit[0] ? (
										<>
											<input
												type="text"
												placeholder="姓名"
												className="mb-2"
											/>
											<br />
											<input type="text" placeholder="地址" />
										</>
									) : (
										<>
											<div>蔡依琳</div>
											<div>台北市信義區松江南路</div>
										</>
									)}
								</div>
							</div>
							<div className="d-flex ps-1">
								<FormControlLabel
									control={
										<Checkbox
											checked={check[0]}
											onChange={() => {
												handleCheck(0);
											}}
											sx={{
												color: '#fe6f67',
												borderRadius: '25px',
												'&.Mui-checked': {
													color: '#fe6f67',
												},
											}}
										/>
									}
									label={check[0] ? '預設地址' : '設為預設地址'}
								/>

								<Button
									variant="contained"
									sx={{
										color: '#FFF',
										background: '#747474',
									}}
									className="ms-auto"
									onClick={() => {
										handleEdit(0);
									}}
								>
									{edit[0] ? '完成' : '編輯'}
								</Button>
							</div>
						</li>
						<hr />
						<li>
							<div className="d-flex align-items-start gap-3">
								<Img
									src={'/icon/address.svg'}
									width={30}
									height={50}
									className="align-self-center"
								/>
								<div>
									<h3>收件人</h3>
									{edit[1] ? (
										<>
											<input
												type="text"
												placeholder="姓名"
												className="mb-2"
											/>
											<br />
											<input type="text" placeholder="地址" />
										</>
									) : (
										<>
											<div>蔡依琳</div>
											<div>台北市信義區松江南路</div>
										</>
									)}
								</div>
							</div>
							<div className="d-flex ps-1">
								<FormControlLabel
									control={
										<Checkbox
											checked={check[1]}
											onChange={() => {
												handleCheck(1);
											}}
											sx={{
												color: '#fe6f67',
												borderRadius: '25px',
												'&.Mui-checked': {
													color: '#fe6f67',
												},
											}}
										/>
									}
									label={check[1] ? '預設地址' : '設為預設地址'}
								/>

								<Button
									variant="contained"
									sx={{
										color: '#FFF',
										background: '#747474',
									}}
									className="ms-auto"
									onClick={() => {
										handleEdit(1);
									}}
								>
									{edit[1] ? '完成' : '編輯'}
								</Button>
							</div>
						</li>
						<hr />
						<li>
							<div className="d-flex align-items-start gap-3">
								<Img
									src={'/icon/address.svg'}
									width={30}
									height={50}
									className="align-self-center"
								/>
								<div>
									<h3>收件人</h3>
									{edit[2] ? (
										<>
											<input
												type="text"
												placeholder="姓名"
												className="mb-2"
											/>
											<br />
											<input type="text" placeholder="地址" />
										</>
									) : (
										<>
											<div>蔡依琳</div>
											<div>台北市信義區松江南路</div>
										</>
									)}
								</div>
							</div>
							<div className="d-flex ps-1">
								<FormControlLabel
									control={
										<Checkbox
											checked={check[2]}
											onChange={() => {
												handleCheck(2);
											}}
											sx={{
												color: '#fe6f67',
												borderRadius: '25px',
												'&.Mui-checked': {
													color: '#fe6f67',
												},
											}}
										/>
									}
									label={check[2] ? '預設地址' : '設為預設地址'}
								/>

								<Button
									variant="contained"
									sx={{
										color: '#FFF',
										background: '#747474',
									}}
									className="ms-auto"
									onClick={() => {
										handleEdit(2);
									}}
								>
									{edit[2] ? '完成' : '編輯'}
								</Button>
							</div>
						</li>
						<hr />
					</ul>
				</div>
			</div>
			<Footer bgColor="#fcf3ea" />
		</>
	);
}
