import React from 'react';
import UserSidebar from '@/components/user/userSideBar';
import Styles from '@/components/user/userBox/userBox.module.scss';

export default function UserBox({ children }) {
	return (
		<div className={Styles['TIL-body']}>
			<div className={`${Styles['TIL-userbody']} container`}>
				<div className="row">
					{/* 左側導航欄 */}
					<div className="col-12 col-md-2 p-0 pe-md-2">
						<UserSidebar />
					</div>

					{/* 右側內容區域 */}
					<div className={`${Styles['TIL-user-right']} col-12 col-md-10 p-0 p-md-5`}>
						<div className={`${Styles['TIL-content-title']} d-block d-md-none p-0`}>
							修改個人資料
						</div>
						<div>{children}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
