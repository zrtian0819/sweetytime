import React, { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import UserBox from "@/components/user/userBox";
import CouponItem from "@/components/coupon/CouponItem";
import Styles from "@/styles/user.module.scss";

export default function VoucherWallet() {
  const MenuItem = ({ icon, text }) => (
    <a
      href="#"
      className="flex items-center px-8 py-3 text-gray-600 hover:bg-white/30 transition-colors"
    >
      <i className={`fas ${icon} text-red-400 mr-3`}></i>
      {text}
    </a>
  );

  const [open, setOpen] = useState([false, false, false]);

  const handleClick = (index) => {
    const newOpen = open.map((isOpen, i) => (i === index ? !isOpen : isOpen));
    setOpen(newOpen);
  };

  // 範例優惠券數據
  const coupons = [
    {
      discount: "9",
      title: "白色聖誕月優惠券",
      date: "2024/12/01",
    },
    {
      discount: "6.5",
      title: "新春納福感恩回饋",
      date: "2025/01/20",
    },
    {
      discount: "8.5",
      title: "萬乘甜點趴",
      date: "2024/12/01",
    },
    {
      discount: "6.5",
      title: "新春納福感恩回饋",
      date: "2025/01/20",
    },
    {
      discount: "6.5",
      title: "新春納福感恩回饋",
      date: "2025/01/20",
    },
    {
      discount: "6.5",
      title: "新春納福感恩回饋",
      date: "2025/01/20",
    },
  ];

  return (
    <>
      <Header />
      <div className={`${Styles["TIL-body"]} container`}>
        <div
          className={`${Styles["TIL-userbody"]} d-flex flex-column flex-md-row`}
        >
          <UserBox>
            <div className={`${Styles["TIL-user-right"]}`}>
              <div className="container  overflow-y-auto">
                <input
                  className="w-100 mb-3"
                  type="text"
                  placeholder="透過賣家名稱，訂單編號或商品名稱搜尋 "
                />
                {/* 標籤分頁 */}
                <ul className={`${Styles["nav"]} ${Styles["nav-pills"]} mb-4`}>
                  <li className={`${Styles["nav-item"]}`}>
                    <a
                      className={`${Styles["nav-link"]} ${Styles["active"]}`}
                      aria-current="page"
                      href="#"
                    >
                      全部
                    </a>
                  </li>
                  <li className={`${Styles["nav-item"]}`}>
                    <a className={`${Styles["nav-link"]}`} href="#">
                      可使用
                    </a>
                  </li>
                  <li className={`${Styles["nav-item"]}`}>
                    <a className={`${Styles["nav-link"]}`} href="#">
                      已失效
                    </a>
                  </li>
                </ul>
                {/* 優惠券列表 */}
                <div className="container">
                  <div
                    className={`${Styles["coupon"]} row g-3`}
                    style={{ maxWidth: "800px", margin: "0 auto" }}
                  >
                    {coupons.map((coupon, index) => (
                      <div
                        key={index}
                        className="col-lg-6 col-md-12 d-flex justify-content-center"
                      >
                        <CouponItem
                          discount={coupon.discount}
                          title={coupon.title}
                          date={coupon.date}
                          showClaimButton={false} // 只隱藏領取按鈕
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </UserBox>
        </div>
      </div>
      <Footer />
    </>
  );
}
