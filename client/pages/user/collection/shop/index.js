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
  const [currentSearchTerm, setCurrentSearchTerm] = useState(''); // 用於追踪當前實際搜索的詞

  const fetchShops = async (page, search) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/collection/shop`,
        {
          params: { 
            page, 
            search, 
            limit: 6 
          },
          headers: { 
            Authorization: `Bearer ${token}` 
          }
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

  // 只在頁碼變化時獲取數據,使用當前的搜索詞
  useEffect(() => {
    fetchShops(currentPage, currentSearchTerm);
  }, [currentPage, currentSearchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // 重置頁碼到第一頁
    setCurrentSearchTerm(searchTerm); // 更新當前搜索詞,這會觸發useEffect
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRemoveCollection = async (deletedId) => {
    setShops(prev => prev.filter(shop => shop.id !== deletedId));
  };

  // 清空搜索
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentSearchTerm('');
    setCurrentPage(1);
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

          {currentSearchTerm && (
            <div className="d-flex justify-content-center gap-2 align-items-center">
              <span>搜尋: {currentSearchTerm}</span>
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={handleClearSearch}
              >
                清除搜尋
              </button>
            </div>
          )}

          {loading && <div className="text-center py-5">載入中...</div>}

          {error && <div className="text-center py-5 text-danger">{error}</div>}

          {!loading && !error && (
            <>
              <div className="d-flex flex-row flex-wrap justify-content-center gap-5">
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

              {shops.length > 0 && (
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
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