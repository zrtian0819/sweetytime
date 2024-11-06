import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import EditNewsForm from '@/components/EditTeacherForm';
import AdminLayout from '@/components/AdminLayout';

const LYTSwal = withReactContent(Swal);

const EditNews = () => {
	const [newsId] = useState(1);
	const openEditNewsPopup = () => {
		LYTSwal.fire({
			title: '修改文章資料',
			html: (
				<EditNewsForm
					newsId={newsId}
					onSubmit={(data) => {
						console.log('提交的文章資訊:', data);
						LYTSwal.close();
					}}
					onCancel={() => LYTSwal.close()}
				/>
			),
			showConfirmButton: false,
			allowOutsideClick: false,
		});
	};

	return (
		<AdminLayout>
			<button onClick={openEditNewsPopup}>編輯文章資料</button>
		</AdminLayout>
	);
};

export default EditNews;
