import React, { useState } from 'react';
import Img from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import Styles from '@/styles/user.module.scss';

import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import { Checkbox } from '@mui/material';

export default function Lesson() {
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
			<UserBox>
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
			</UserBox>
			<Footer bgColor="#fcf3ea" />
		</>
	);
}
