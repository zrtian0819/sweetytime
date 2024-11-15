import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import CollectionCard from '@/components/user/collection/CollectionCard';
import Pagination from '@/components/pagination';
import Styles from '@/styles/user.module.scss';
import { FaSearch } from 'react-icons/fa';
import { withAuth } from '@/components/auth/withAuth';
import axios from 'axios';

function UserShop() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchShops = async (page, search = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/collection/shop`,
        {
          params: { page, search, limit: 6 },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      let shopData = Array.isArray(response.data.data) ? response.data.data 
                   : Array.isArray(response.data.shops) ? response.data.shops 
                   : [];

      setShops(shopData);
      setTotalPages(response.data.totalPages || Math.ceil(shopData.length / 6) || 1);
    } catch (err) {
      console.error('錯誤詳情:', err.response || err);
      setError('無法載入店家數據');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchShops(1, searchTerm);
  };

  const handleRemoveCollection = async (deletedId) => {
    // 從列表中移除已刪除的項目
    setShops(prev => prev.filter(shop => shop.id !== deletedId));
  };
  return (
    <>
      <Header />
      <UserBox>
        <div className="d-flex flex-column py-5 p-md-0 gap-3">
          <form className={`${Styles['TIL-search']} d-flex justify-content-center gap-2`} onSubmit={handleSearch}>
            <input
              type="text"
              className="px-3"
              placeholder="透過店家名稱搜尋"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className={`${Styles['TIL-Btn']} btn p-0`}>
              <FaSearch size={25} className={Styles['TIL-Fa']} />
            </button>
          </form>

          {loading && <div className="text-center py-5">載入中...</div>}

          {!loading && (
            <>
              <div className="d-flex flex-column flex-wrap justify-content-center gap-2">
                {shops.map((shop) => (
                  <CollectionCard
                    key={shop.id}
                    type="shop"
                    data={shop}
                    onRemove={handleRemoveCollection}
                  />
                ))}
              </div>

              {shops.length === 0 && (
                <div className="text-center">沒有找到相關店家</div>
              )}
            </>
          )}
        </div>
      </UserBox>
      <Footer />
    </>
  );
}

export default withAuth(UserShop);