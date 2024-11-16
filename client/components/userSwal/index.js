import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import style from './popup.module.scss';

const SYSwal = withReactContent(Swal);

const SwalDetails = ({ userView, onClose }) => {
  useEffect(() => {
    if (!userView) return;

    SYSwal.fire({
      title: userView.name,
      html: `
        <div class="${style['swal-content']}">
          <img src="/photos/user/${userView.portrait_path}" alt="${userView.name}" class="${style['profile-image']}" />
          <table class="table table-hover" style="width: 100%;">
            <tbody>
              <tr>
                <th>ID</th>
                <td>${userView.id || '無資料'}</td>
              </tr>
              <tr>
                <th>帳號</th>
                <td>${userView.account || '無資料'}</td>
              </tr>
              <tr>
                <th>名稱</th>
                <td>${userView.name || '無資料'}</td>
              </tr>
              <tr>
                <th>電話</th>
                <td>${userView.phone || '無資料'}</td>
              </tr>
              <tr>
                <th>電子郵件</th>
                <td>${userView.email || '無資料'}</td>
              </tr>
              <tr>
                <th>生日</th>
                <td>${userView.birthday || '無資料'}</td>
              </tr>
              <tr>
                <th>狀態</th>
                <td>${userView.status === 1 ? '啟用' : '停用'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
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
        document.querySelector(`.${style['swal-content']}`).scrollTop = 0;
      }
    }).then(() => onClose());
  }, [userView, onClose]);

  return null;
};

export default SwalDetails;
