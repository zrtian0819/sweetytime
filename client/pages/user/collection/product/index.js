import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import ProductCard from '@/components/user/collection/product-card';
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
            console.log('API 回應原始資料:', response.data);
            let productData;
            if (Array.isArray(response.data.data)) {
                productData = response.data.data;
            } else if (Array.isArray(response.data.products)) {
                productData = response.data.products;
            } else {
                console.error('無法解析商品資料，API 回應:', response.data);
                productData = [];
            }
            console.log('處理後的商品資料:', productData);

            const totalPagesData =
                response.data.totalPages || Math.ceil(productData.length / 6) || 1;
            console.log('總頁數:', totalPagesData);

            setProducts(productData);
            setTotalPages(totalPagesData);
            setError(null);
        } catch (err) {
            console.error('錯誤詳情:', err.response || err);
            setError('無法載入商品數據');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage, searchTerm);
    }, [currentPage]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchProducts(1, searchTerm);
    };

    return (
        <>
            <Header />
            <UserBox>
                <div className="d-flex flex-column py-5 p-md-0 gap-3">
                    <div className={`${Styles['TIL-search']} d-flex justify-content-center gap-2`}>
                        <input 
                            type="text" 
                            className="px-3" 
                            placeholder="透過商品名稱搜尋"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button 
                            className={`${Styles['TIL-Btn']} btn p-0`}
                            onClick={handleSearch}
                        >
                            <FaSearch size={25} className={Styles['TIL-Fa']} />
                        </button>
                    </div>
                    <div className="d-flex flex-row flex-wrap justify-content-center gap-5">
                        {loading ? (
                            <div>載入中...</div>
                        ) : error ? (
                            <div>{error}</div>
                        ) : products.length === 0 ? (
                            <div>沒有找到商品</div>
                        ) : (
                            products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))
                        )}
                    </div>
                    <div className="m-auto">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            changeColor="#fe6f67"
                        />
                    </div>
                </div>
            </UserBox>
            <Footer bgColor="#fcf3ea" />
        </>
    );
}

export default withAuth(UserProduct);