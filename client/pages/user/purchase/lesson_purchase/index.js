import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Styles from '@/styles/user.module.scss';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import PurchaseCard from '@/components/purchase-card';
import Pagination from '@/components/pagination';
import { withAuth } from '@/components/auth/withAuth';
import { FaSearch } from 'react-icons/fa';
import { useUser } from '@/context/userContext';

function UserPurchase() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 3;

  // 使用 useMemo 優化搜尋效能
  const filteredOrders = useMemo(() => {
    console.log('Current search term:', searchTerm);
    console.log('Current orders:', orders);

    if (!searchTerm.trim()) {
      return orders;
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    
    const filtered = orders.filter((order) => {
      // 檢查收件人姓名
      const matchDeliveryName = order.delivery_name && 
        order.delivery_name.toLowerCase().includes(searchLower);
      
      // 檢查訂單編號
      const matchOrderId = order.id && 
        order.id.toString().includes(searchLower);
      
      // 檢查商品名稱
      const matchProductName = order.items && 
        order.items.some(item => 
          item.product_name && 
          item.product_name.toLowerCase().includes(searchLower)
        );

      const result = matchDeliveryName || matchOrderId || matchProductName;
      
      // 除錯日誌
      console.log('Order:', order);
      console.log('Matches:', {
        delivery: matchDeliveryName,
        orderId: matchOrderId,
        product: matchProductName
      });

      return result;
    });

    console.log('Filtered results:', filtered);
    return filtered;
  }, [orders, searchTerm]);

  // 使用 useMemo 優化分頁計算
  const { currentItems, totalPages } = useMemo(() => {
    const total = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const items = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    console.log('Pagination calculation:', {
      total,
      currentPage,
      items
    });

    return {
      currentItems: items,
      totalPages: total
    };
  }, [filteredOrders, currentPage]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('請先登入');
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/orders/details`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        console.log('API Response:', response.data);
        setOrders(response.data.data);
      } else {
        throw new Error(response.data.message || '獲取訂單失敗');
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      setError(error.message || '獲取訂單資料失敗');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetchOrders();
    }
  }, [user]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log('Search input changed:', value);
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Header />
      <UserBox>
        <div className="d-flex flex-column py-5 gap-5 w-100">
          <form
            className={`${Styles['TIL-search']} d-flex justify-content-center gap-2`}
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              className="px-3"
              placeholder="透過收件人名稱、訂單編號或商品名稱搜尋"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button 
              type="button" 
              className={`${Styles['TIL-Btn']} btn p-0`}
              aria-label="搜尋"
            >
              <FaSearch size={25} className={Styles['TIL-Fa']} />
            </button>
          </form>

          <div className="px-3 px-md-0 d-flex flex-column gap-3">
            {isLoading ? (
              <div className="text-center">載入中...</div>
            ) : error ? (
              <div className="text-center text-danger">{error}</div>
            ) : currentItems.length === 0 ? (
              <div className="text-center">
                {searchTerm ? '沒有符合搜尋條件的訂單' : '目前沒有訂單'}
              </div>
            ) : (
              currentItems.map((item) => (
                <PurchaseCard key={item.id} {...item} />
              ))
            )}
          </div>

          {!isLoading && !error && currentItems.length > 0 && (
            <div className="m-auto">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                changeColor="#fe6f67"
              />
            </div>
          )}
        </div>
      </UserBox>
      <Footer />
    </>
  );
}

export default withAuth(UserPurchase);