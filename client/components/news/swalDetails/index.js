// components/news/swalDetails.js
import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const LYTSwal = withReactContent(Swal);

const SwalDetails = ({ news, onClose }) => {
	useEffect(() => {
		if (!news) return;

		LYTSwal.fire({
			title: news.title,
			html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <img src="${news.imgSrc}" alt="${news.title}" width="200" height="200" style="border-radius: 8px; margin-bottom: 20px;" />
          <table class="table table-hover" style="width: 100%;">
            <tbody>
              <tr>
                <th>標題</th>
                <td>${news.title}</td>
              </tr>
              <tr>
                <th>分類</th>
                <td>${news.category}</td>
              </tr>
              <tr>
                <th>建立時間</th>
                <td>${news.date}</td>
              </tr>
              <tr>
                <th>作者</th>
                <td>Frontend Hero</td>
              </tr>
              <tr>
                <th>狀態</th>
                <td>${news.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
			showCloseButton: true,
			confirmButtonText: '關閉',
			width: '50%',
			customClass: {
				popup: 'LYT-swal-popup',
			},
		}).then(() => onClose());
	}, [news, onClose]);

	return null; // 不需要渲染任何 DOM 元素
};

export default SwalDetails;
