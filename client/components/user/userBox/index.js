import React from 'react';
import UserSidebar from '@/components/user/userSideBar';
import Styles from '@/components//user/userBox/userBox.module.scss';

export default function UserBox({ children }) {
	return (
		<>
			<div className={`${Styles['TIL-body']} test-mode`}>
				<div className={`${Styles['TIL-userbody']} container `}>
					<div className="row h-100">
						<div className="col-12 col-md-2 pe-2 ps-0 h-100 ">
							<UserSidebar />
						</div>
						<div className={`${Styles['TIL-user-right']} col-10 col-md-10`}>
							{children}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
