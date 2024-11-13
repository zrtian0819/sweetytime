import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import style from './index.module.scss';

const LYTSwal = withReactContent(Swal);

const SwalDetails = ({ news, onClose }) => {
	useEffect(() => {
		if (!news) return;

		LYTSwal.fire({
			title: news.title,
			html: `
        <div class="${style['swal-content']}">
          <img src="/photos/articles/${news.img_path || `/photos/ImgNotFound.png`}" alt="${
				news.title
			}" style="width: 50%; height: auto; object-fit: cover; border-radius: 8px;" / >
          <table class="table table-hover" style="width: 100%; text-align: center;">
            <tbody>
              <tr>
                <th>標題</th>
                <td>${news.title || '無資料'}</td>
              </tr>
              ${
					news.class_name
						? `
              <tr>
                <th>分類</th>
                <td>${news.class_name}</td>
              </tr>
              `
						: ''
				}
              ${
					news.content
						? `
              <tr>
                <th>內文</th>
                <td>${news.content}</td>
              </tr>
              `
						: ''
				}
              ${
					news.createdAt
						? `
              <tr>
                <th>建立時間</th>
                <td>${news.createdAt}</td>
              </tr>
              `
						: ''
				}
              <tr>
                <th>作者</th>
                <td>Frontend Hero</td>
              </tr>
              ${
					news.activation
						? `
              <tr>
                <th>狀態</th>
                <td>${news.activation === 1 ? '上架中' : '未上架'}</td>
              </tr>
              `
						: ''
				}
            </tbody>
          </table>
        </div>
      `,
			showCloseButton: true,
			showConfirmButton: false,
			width: '60%',
			customClass: {
				popup: style['LYT-swal-popup'],
				closeButton: style['custom-close-button'],
			},
			showClass: {
				popup: 'animate__animated animate__slideInUp',
			},
			hideClass: {
				popup: 'animate__animated animate__fadeOutDown',
			},
			didOpen: () => {
				const contentElement = document.querySelector(`.${style['swal-content']}`);
				if (contentElement) {
					contentElement.scrollTop = 0;
				}
			},
		}).then(() => onClose());
	}, [news, onClose]);

	return null;
};

export default SwalDetails;
