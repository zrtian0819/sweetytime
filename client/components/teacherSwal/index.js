import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import style from './popup.module.scss';

const SYSwal = withReactContent(Swal);
const SwalDetails = ({ teacherView, onClose }) => {
  useEffect(() => {
    if (!teacherView) return;

    SYSwal.fire({
      title: teacherView.title,
      html: `
        <div class="${style['swal-content']} ">
          <img src="${teacherView.imgSrc}" alt="${teacherView.title}" class="${style['profile-image']}" />
          <table class="table table-hover ${style['profile-table']}" style="width: 100%;">
            <tbody>
              <tr>
                <th>專業領域</th>
                <td>${teacherView.expertise || '無資料'}</td>
              </tr>
              ${teacherView.experience ? `
              <tr>
                <th>經歷</th>
                <td>${teacherView.experience}</td>
              </tr>
              ` : ''}
              ${teacherView.education ? `
              <tr>
                <th>學歷</th>
                <td>${teacherView.education}</td>
              </tr>
              ` : ''}
              ${teacherView.licence ? `
              <tr>
                <th>證書</th>
                <td>${teacherView.licence}</td>
              </tr>
              ` : ''}
              ${teacherView.awards ? `
              <tr>
                <th>獎項</th>
                <td>${teacherView.awards}</td>
              </tr>
              ` : ''}
              ${teacherView.description ? `
              <tr>
                <th>簡介</th>
                <td>${teacherView.description}</td>
              </tr>
              ` : ''}
              <tr>
                <th>狀態</th>
                <td>${teacherView.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
      showCloseButton: true, // 右上角的 "X" 按鈕
      showConfirmButton: false, // 隱藏底部按鈕
      width: '600px',
      customClass: {
        popup: style['SY-swal-popup'],
        closeButton: style['custom-close-button'],
      },
      showClass: {
        popup: 'animate__animated animate__slideInUp'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutDown'
      },
      didOpen: () => {
        // 滾動視窗內容到頂部
        document.querySelector(`.${style['swal-content']}`).scrollTop = 0;
      }
    }).then(() => onClose());
  }, [teacherView, onClose]);

  return null;
};

export default SwalDetails;
