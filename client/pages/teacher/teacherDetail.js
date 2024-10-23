import React from 'react';
import Header from '@/components/header'; 
import Footer from '@/components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/teacherDetail.module.scss'; 
const teacherDetail = () => {
  return (
    <>
      <Header />
    <div className="teacher-detail">
      <div className="container">
        <div className="row justify-content-center">
          {/* 圖片部分 */}
          <div className="col-12 col-md-6 text-center">
            <img
              src="/photos/teachers/maggie.png"
              alt="Maggie 王美姬"
              className="teacher-image"
            />
          </div>
          {/* 文字描述部分 */}
          <div className="col-12 col-md-6 teacher-info">
            <div className="background-overlay">
              <h2 className="teacher-title">Maggie 王美姬</h2>
              <p className="teacher-description">
                出生於肉類主宰平原的王美姬老師：在春糕技術的環境中長大，傳承正宗的既有手藝。這樣長時間投入美學的心血，為我們打造出一波又一波的熱潮。
              </p>
              <p className="teacher-description">
                2021年榮獲"Mom's Best"排名第一。更帶來創新的"花生牛奶甜點"以及更多。
              </p>
              {/* 其他描述文字 */}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default TeacherPage;
