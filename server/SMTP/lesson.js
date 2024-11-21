import nodemailer from 'nodemailer'

// 設定發信帳號與應用專用密碼
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_TO_EMAIL, // 從 .env 環境變數中讀取
    pass: process.env.SMTP_TO_PASSWORD, // 應用專用密碼
  },
})

// 建立發信函數
export const sendOrderConfirmation = async (userMail, lesson) => {
  const mailOptions = {
    from: process.env.SMTP_TO_EMAIL,
    to: userMail,
    subject: '報名成功通知',
    text: `感謝您報名${lesson.name}！`,
    html: `
    <!DOCTYPE html>
        <html>
        <body>
            <h1>感謝您的報名！</h1>
            <p>您的報名詳情如下：</p>
            <p>課程名稱：${lesson.name}</p><p>時間：${lesson.start_date}</p>
            <p>地點：${lesson.classroom_name} ${lesson.location} </p>
            <a href="http://localhost:3000/lesson/${lesson.id}" style="color: #ffffff;
        background-color: #fe6f67;
        padding: 10px;
        text-decoration: none;
        text-align: center;
        align-content: center">了解更多</a>
        </body>
        </html>
   `,
  }
  console.log('Mail options:', mailOptions)
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('發信成功：' + info.response)
  } catch (error) {
    console.error('發信失敗：', error)
  }
}
