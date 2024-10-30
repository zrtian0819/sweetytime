import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import Styles from '@/styles/user.module.scss';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';

export default function Lesson() {
	return (
		<>
			<Header />
			<UserBox>
				<div className={`${Styles['TIL-userbody']} d-flex flex-column flex-md-row`}>
					<div className={`${Styles['TIL-user-right']}`}>
						<div className="container-fluid ">
							<div className="row d-flex justify-content-start ms-5">
								<div className="col-5 col-md-4">使用者帳號</div>
								<div className="col-auto">AiBao_baoFamily0524</div>
							</div>
						</div>
						<hr />
						<div className="container-fluid ">
							<div className="row d-flex justify-content-start ms-5 align-items-center">
								<div className="col-4">姓名</div>
								<div className="col-auto">
									<input type="text" />
								</div>
								<div className="d-none d-md-flex col-2 m-auto">
									<Button
										variant="contained"
										sx={{
											color: '#FFF',
											background: '#fe6f67',
										}}
									>
										變更
									</Button>
								</div>
							</div>
						</div>
						<hr />
						<div className="container-fluid">
							<div className="row d-flex justify-content-start ms-5 align-items-center">
								<div className="col-4">E-mail</div>
								<div className="col-auto">
									<input />
								</div>
								<div className="col-2 m-auto">
									<Button
										variant="contained"
										sx={{
											color: '#FFF',
											background: '#fe6f67',
										}}
										className="d-none d-md-block"
									>
										變更
									</Button>
								</div>
							</div>
						</div>
						<hr />
						<div className="container-fluid">
							<div className="row d-flex justify-content-start ms-5 align-items-center">
								<div className="col-4">電話號碼</div>
								<div className="col-auto">
									<input type="text" />
								</div>
								<div className="col-2 m-auto">
									<Button
										variant="contained"
										sx={{
											color: '#FFF',
											background: '#fe6f67',
										}}
										className="d-none d-md-block"
									>
										變更
									</Button>
								</div>
							</div>
						</div>
						<hr />
						<div className="container-fluid">
							<div className="row d-flex justify-content-start ms-5 align-items-center">
								<FormLabel
									id="demo-row-radio-buttons-group-label"
									className="fw-bold col-4"
								>
									性別
								</FormLabel>
								<FormControl className="col-auto">
									<RadioGroup
										row
										aria-labelledby="demo-row-radio-buttons-group-label"
										name="row-radio-buttons-group"
									>
										<FormControlLabel
											value="male"
											control={
												<Radio
													sx={{
														color: '#fe6f67',
														'&.Mui-checked': {
															color: '#fe6f67',
														},
													}}
												/>
											}
											label="男性"
										/>
										<FormControlLabel
											value="female"
											control={
												<Radio
													sx={{
														color: '#fe6f67',
														'&.Mui-checked': {
															color: '#fe6f67',
														},
													}}
												/>
											}
											label="女性"
										/>
										<FormControlLabel
											value="other"
											control={
												<Radio
													sx={{
														color: '#fe6f67',
														'&.Mui-checked': {
															color: '#fe6f67',
														},
													}}
												/>
											}
											label="其他"
										/>
									</RadioGroup>
								</FormControl>
							</div>
						</div>
						<hr />
						<div className="container-fluid">
							<div className="row d-flex justify-content-start ms-5 align-items-center">
								<div className="col-4">生日</div>
								<div className="col-auto">
									<input type="date" />
								</div>
								<div className="col-2 m-auto">
									<Button
										variant="contained"
										sx={{
											color: '#FFF',
											background: '#fe6f67',
										}}
										className="d-none d-md-block"
									>
										變更
									</Button>
								</div>
							</div>
						</div>
						<hr />
						<div className="container-fluid">
							<div className="row d-flex justify-content-start ms-5 align-items-center">
								<div className="col-4">地址</div>
								<div className="col-auto">
									<input />
								</div>
								<div className="col-2 m-auto">
									<Button
										variant="contained"
										sx={{
											color: '#FFF',
											background: '#fe6f67',
										}}
										className="d-none d-md-block"
									>
										變更
									</Button>
								</div>
							</div>
						</div>
						<hr />
						<Button
							variant="contained"
							sx={{
								color: '#FFF',
								background: '#fe6f67',
							}}
							className="ms-auto"
						>
							儲存
						</Button>
					</div>
				</div>
			</UserBox>
			<Footer bgColor="#fcf3ea" />
		</>
	);
}
