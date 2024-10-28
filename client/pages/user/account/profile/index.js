import React from 'react';
import Img from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
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
					<div className={`${Styles['TIL-user-left']}`}>
						<div className={`${Styles['TIL-user-left-menu-picHead']}`}>
							<Img
								src="/photos/users/user_panda.png"
								alt="頭像"
								width={100}
								height={100}
								className="rounded-circle object-fit-cover shadow-sm"
							/>
						</div>
						<ul className={`${Styles['TIL-user-left-menu']}`}>
							<li>
								<a className={`${Styles['TIL-user-left-menu-active']}`} href="#">
									我的帳戶
								</a>
								<ul className={`${Styles['TIL-user-left-submenu']}`}>
									<li>
										<a
											className={`${Styles['TIL-user-left-submenu-active']}`}
											href="#"
										>
											個人檔案
										</a>
									</li>
									<li>
										<a href="#">付費方式</a>
									</li>
									<li className="active">
										<a href="#">地址管理</a>
									</li>
									<li>
										<a href="#">更改密碼</a>
									</li>
								</ul>
							</li>
							<li>
								<a href="#">我的收藏</a>
								<ul className={`${Styles['TIL-user-left-submenu']}`}>
									<li>
										<a href="#">收藏店家</a>
									</li>
									<li>
										<a href="#">商藏商品</a>
									</li>
									<li>
										<a href="#">收藏課程</a>
									</li>
								</ul>
							</li>
							<li>
								<a href="#">購買清單</a>
							</li>
							<li>
								<a href="#">會員好康</a>
							</li>
						</ul>
					</div>
					<div className={`${Styles['TIL-user-right']}`}>
						<div className="d-flex justify-content-start ms-5">
							<div className="me-5">使用者帳號</div>
							<div>AiBao_baoFamily0524</div>
						</div>
						<hr />
						<div className="d-flex justify-content-between ms-5 align-items-center">
							<div className="me-5">姓名</div>
							<div>
								<input type="text" />
							</div>
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
						<hr />
						<div className="d-flex justify-content-between ms-5 align-items-center">
							<div className="me-5">E-mail</div>
							<div>
								<input />
							</div>
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
						<hr />
						<div className="d-flex justify-content-between ms-5 align-items-center">
							<div className="me-5">電話號碼</div>
							<div>
								<input />
							</div>
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
						<hr />
						<div className="d-flex justify-content-start ms-5 align-items-center">
							<FormLabel id="demo-row-radio-buttons-group-label" className="me-5">
								性別
							</FormLabel>
							<FormControl>
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
						<hr />
						<div className="d-flex justify-content-between ms-5 align-items-center">
							<div className="me-5">生日</div>
							<div>
								<input type="date" />
							</div>
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
						<hr />
						<div className="d-flex justify-content-between ms-5 align-items-center">
							<div className="me-5">地址</div>
							<div>
								<input />
							</div>
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
			</div>
			<div className={`${Styles['TIL-body-mb']} mt-5 d-flex d-md-none flex-column container`}>
				<div className="user-header d-flex mt-5 justify-content-center">
					<div className={`${Styles['TIL-user-left-menu-picHead']}`}>
						<Img
							src="/photos/users/user_panda.png"
							alt="頭像"
							width={100}
							height={100}
							className="rounded-circle object-fit-cover shadow-sm"
						/>
					</div>
					<div className="user-header-right">
						<div>AiBao_baoFamily0524</div>
						<div>管理個人資料</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
