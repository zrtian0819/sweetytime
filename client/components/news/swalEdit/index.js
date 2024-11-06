// EditNews.js
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import EditNewsForm from './EditNewsForm';

const EditNews = ({ newsId }) => {
	const MySwal = withReactContent(Swal);
	const [newsData, setNewsData] = useState({
		/* 初始值 */
	});

	const handleOpenPopup = () => {
		MySwal.fire({
			title: '編輯新聞',
			html: (
				<EditNewsForm
					newsData={newsData}
					onInputChange={handleInputChange}
					onEditorChange={handleEditorChange}
					onCheckboxChange={handleCheckboxChange}
					onImageChange={handleImageChange}
					onCategoryChange={handleCategoryChange}
					onSubmit={handleSubmit}
				/>
			),
			showConfirmButton: false,
			width: '80%', // 視需求調整
		});
	};

	// 填入表單資料，處理 submit 時執行的函數等...

	return null;
};

export default EditNews;
