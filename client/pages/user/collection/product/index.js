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

function UserProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentSearchTerm, setCurrentSearchTerm] = useState(''); // 追蹤當前搜尋條件

    const handleRemoveCollection = (deletedId) => {
        setProducts(prev => prev.filter(product => product.id !== deletedId));
    };

    const fetchProducts = async (page, search = '') => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/collection/product`,
                {
                    params: {
                        page,
                        search,
                        limit: 6,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // 處理回應數據
            let productData = Array.isArray(response.data.data) ? response.data.data 
                          : Array.isArray(response.data.products) ? response.data.products 
                          : [];

            const totalPagesData = response.data.totalPages || Math.ceil(productData.length / 6) || 1;

            setProducts(productData);
            setTotalPages(totalPagesData);
            setError(null);
        } catch (err) {
            console.error('錯誤詳情:', err.response || err);
            setError('無法載入商品數據');
            setProducts([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    // 當頁碼或搜尋條件改變時重新獲取數據
    useEffect(() => {
        fetchProducts(currentPage, currentSearchTerm);
    }, [currentPage, currentSearchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // 重置到第一頁
        setCurrentSearchTerm(searchTerm); // 更新當前搜尋條件
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // 清除搜尋
    const handleClearSearch = () => {
        setSearchTerm('');
        setCurrentSearchTerm('');
        setCurrentPage(1);
    };

    return (
        <>
            <Header />
            <UserBox>
            <h2 className={`${Styles['WGS-pColor']}`}>收藏商品</h2>
                <div className="d-flex flex-column py-5 p-md-0 gap-3">
                    <form 
                        className={`${Styles['TIL-search']} d-flex justify-content-center gap-2`}
                        onSubmit={handleSearch}
                    >
                        <input 
                            type="text" 
                            className="px-3" 
                            placeholder="透過商品名稱搜尋"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button 
                            type="submit"
                            className={`${Styles['TIL-Btn']} btn p-0`}
                        >
                            <FaSearch size={25} className={Styles['TIL-Fa']} />
                        </button>
                    </form>

                    {currentSearchTerm && (
                        <div className="d-flex justify-content-center gap-2 align-items-center">
                            <span>目前搜尋: {currentSearchTerm}</span>
                            <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={handleClearSearch}
                            >
                                清除搜尋
                            </button>
                        </div>
                    )}

                    <div className="d-flex flex-row flex-wrap justify-content-center gap-5">
                        {loading ? (
                            <div className="text-center py-5">載入中...</div>
                        ) : error ? (
                            <div className="text-center py-5 text-danger">{error}</div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-5">
                                {currentSearchTerm ? '沒有找到相關商品' : '目前沒有收藏的商品'}
                            </div>
                        ) : (
                            products.map((product) => (
                                <CollectionCard
                                    key={product.id}
                                    type="product"
                                    data={product}
                                    onRemove={handleRemoveCollection}
                                />
                            ))
                        )}
                    </div>

                    {products.length > 0 && (
                        <div className="m-auto">
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
            <Footer bgColor="#fcf3ea" />
        </>
    );
}

export default withAuth(UserProduct);