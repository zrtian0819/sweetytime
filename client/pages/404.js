import Header from '@/components/header';

export default function Custom404() {
  return (
    <>
      <Header />
      <div className="box">
        <h2>沒有此頁面,請循正常管道進入。</h2>
      </div>

      <style jsx>
        {`
          .box {
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          h2 {
            color: #ccc;
            text-align: center;
          }
        `}
      </style>
    </>
  );
}
