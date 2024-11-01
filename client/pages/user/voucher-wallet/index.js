import React, { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import UserBox from "@/components/user/userBox";
import CouponItem from "@/components/coupon/CouponItem";
import Pagination from '@/components/pagination';
import Styles from "@/styles/user.module.scss";

export default function VoucherWallet() {
  // 初始狀態設置
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState([false, false, false]);
  
  // 設定每頁顯示數量
  const ITEMS_PER_PAGE = 6;

  const handleClick = (index) => {
    const newOpen = open.map((isOpen, i) => (i === index ? !isOpen : isOpen));
    setOpen(newOpen);
  };

  // 範例優惠券數據
  const coupons = [
    {
      id: "XMAS2024",
      title: "白色聖誕月優惠券",
      description: "聖誕節特製甜點限定優惠",
      type: "PERCENT",
      discount: 10,
      minimumSpend: 1000,
      maximumDiscount: 500,
      status: "AVAILABLE",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      showClaimButton: true,
      termsAndConditions: [
        "限量發行1000份",
        "每人限領一次",
        "不可與其他優惠同時使用",
        "特價商品除外"
      ]
    },
    {
      id: "NEWYEAR2025", 
      title: "新年限定優惠",
      description: "新年首購享優惠",
      type: "FIXED",
      discount: -200,
      minimumSpend: 1500,
      maximumDiscount: 200,
      status: "UPCOMING",
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      showClaimButton: false,
      termsAndConditions: [
        "新會員首次購物可用",
        "每人限用一次",
        "不可與其他優惠同時使用"
      ]
    },
    {
      id: "VIP2024",
      title: "VIP會員專屬優惠",
      description: "VIP會員單筆消費滿額折抵",
      type: "PERCENT",
      discount: 15,
      minimumSpend: 2000,
      maximumDiscount: 1000,
      status: "AVAILABLE",
      startDate: "2024-11-01",
      endDate: "2024-12-31",
      showClaimButton: true,
      termsAndConditions: [
        "限VIP會員使用",
        "每人每月限用一次",
        "特價商品可使用"
      ]
    },
    {
      id: "XMAS2024",
      title: "白色聖誕月優惠券",
      description: "聖誕節特製甜點限定優惠",
      type: "PERCENT",
      discount: 10,
      minimumSpend: 1000,
      maximumDiscount: 500,
      status: "AVAILABLE",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      showClaimButton: true,
      termsAndConditions: [
        "限量發行1000份",
        "每人限領一次",
        "不可與其他優惠同時使用",
        "特價商品除外"
      ]
    },
    {
      id: "NEWYEAR2025", 
      title: "新年限定優惠",
      description: "新年首購享優惠",
      type: "FIXED",
      discount: -200,
      minimumSpend: 1500,
      maximumDiscount: 200,
      status: "UPCOMING",
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      showClaimButton: false,
      termsAndConditions: [
        "新會員首次購物可用",
        "每人限用一次",
        "不可與其他優惠同時使用"
      ]
    },
    {
      id: "VIP2024",
      title: "VIP會員專屬優惠",
      description: "VIP會員單筆消費滿額折抵",
      type: "PERCENT",
      discount: 15,
      minimumSpend: 2000,
      maximumDiscount: 1000,
      status: "AVAILABLE",
      startDate: "2024-11-01",
      endDate: "2024-12-31",
      showClaimButton: true,
      termsAndConditions: [
        "限VIP會員使用",
        "每人每月限用一次",
        "特價商品可使用"
      ]
    },
    {
      id: "XMAS2024",
      title: "白色聖誕月優惠券",
      description: "聖誕節特製甜點限定優惠",
      type: "PERCENT",
      discount: 10,
      minimumSpend: 1000,
      maximumDiscount: 500,
      status: "AVAILABLE",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      showClaimButton: true,
      termsAndConditions: [
        "限量發行1000份",
        "每人限領一次",
        "不可與其他優惠同時使用",
        "特價商品除外"
      ]
    },
    {
      id: "NEWYEAR2025", 
      title: "新年限定優惠",
      description: "新年首購享優惠",
      type: "FIXED",
      discount: -200,
      minimumSpend: 1500,
      maximumDiscount: 200,
      status: "UPCOMING",
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      showClaimButton: false,
      termsAndConditions: [
        "新會員首次購物可用",
        "每人限用一次",
        "不可與其他優惠同時使用"
      ]
    },
    {
      id: "VIP2024",
      title: "VIP會員專屬優惠",
      description: "VIP會員單筆消費滿額折抵",
      type: "PERCENT",
      discount: 15,
      minimumSpend: 2000,
      maximumDiscount: 1000,
      status: "AVAILABLE",
      startDate: "2024-11-01",
      endDate: "2024-12-31",
      showClaimButton: true,
      termsAndConditions: [
        "限VIP會員使用",
        "每人每月限用一次",
        "特價商品可使用"
      ]
    }
  ];
  // 計算總頁數
  const totalPages = Math.ceil(coupons.length / ITEMS_PER_PAGE);

  // 處理分頁變更
  const handlePageChange = (newPage) => {
    // 確保頁碼在有效範圍內
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // 可選：滾動到頁面頂部
      window.scrollTo(0, 0);
    }
  };

  // 獲取當前頁面的優惠券
  const currentCoupons = coupons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <Header />
      <div className={`${Styles["TIL-body"]} container`}>
        <div className={`${Styles["TIL-userbody"]} d-flex flex-column flex-md-row`}>
          <UserBox>
            <div className={`${Styles["TIL-user-right"]}`}>
              <div className="container overflow-y-auto">
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
                    {currentCoupons.map((coupon, index) => (
                      <div
                        key={`${coupon.id}-${index}`}
                        className="col-lg-6 col-md-12 d-flex justify-content-center"
                      >
                        <CouponItem
                          discount={coupon.discount}
                          title={coupon.title}
                          date={`${coupon.startDate} - ${coupon.endDate}`}
                          showClaimButton={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {totalPages > 1 && (
                <div className="m-auto py-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    changeColor="#fe6f67"
                  />
                </div>
              )}
            </div>
          </UserBox>
        </div>
      </div>
      <Footer />
    </>
  );
}
