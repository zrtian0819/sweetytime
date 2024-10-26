import React from 'react';
import Img from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';

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
			<div className={`${Styles['TIL-body']} mt-5 d-flex flex-column container`}>
                    <div className={`${Styles['TIL-userbody']}`}>
                        <div className={`${Styles['TIL-user-left']}`}>
                        <ul className={`${Styles['TIL-user-left-menu']}`}>
                            <li>
                                <a className={`${Styles['TIL-user-left-menu-active']}`} href="#">我的帳戶</a>
                                <ul className={`${Styles['TIL-user-left-submenu']}`}>
                                    <li>
                                        <a className={`${Styles['TIL-user-left-submenu-active']}`} href="#">個人檔案</a>
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
                            456
                        </div>
                    </div>
                </div>

            <Footer />
        </>
	);
}
