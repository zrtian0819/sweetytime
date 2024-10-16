import Header from '@/components/header'
export default function Custom404() {
  return (
    <>
      <Header />
      <div className="center box">
        <h2>沒有此頁面,請循正常管道進入。</h2>
      </div>

      <style jsx>
        {`
          h2 {
            color: #ccc;
            text-align: center;
          }
        `}
      </style>
    </>
  )
}
