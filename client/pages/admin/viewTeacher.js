import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';


export default function TeacherDetail() {
  const teacher = {
    teacher_id: 1,
    name: "劉偉苓 Willin",
    expertise: "糕點製作",
    experience: "10年以上的糕點製作經驗",
    education: "食品科學碩士",
    licence: "專業糕點師證書",
    awards: "全國糕點比賽冠軍",
    description: "擁有豐富的糕點製作經驗，擅長創意糕點設計。",
    img_path: "/photos/teacher/willin.jpg",
    valid: true,
  };

  return (
    <AdminLayout>
      <h1>{teacher.name}</h1>
      <div className="container">
        <div className="row">
          <div className="col-4">
            <Image
              src={teacher.img_path}
              width={300}
              height={300}
              alt={`${teacher.name}的圖片`}
            />
            <table className="table table-hover">
              <tbody>
                <tr>
                  <th>專業領域</th>
                  <td>{teacher.expertise}</td>
                </tr>
                <tr>
                  <th>經歷</th>
                  <td>{teacher.experience}</td>
                </tr>
                <tr>
                  <th>學歷</th>
                  <td>{teacher.education}</td>
                </tr>
                <tr>
                  <th>證書</th>
                  <td>{teacher.licence}</td>
                </tr>
                <tr>
                  <th>獎項</th>
                  <td>{teacher.awards}</td>
                </tr>
                <tr>
                  <th>簡介</th>
                  <td>{teacher.description}</td>
                </tr>
                <tr>
                  <th>狀態</th>
                  <td>{teacher.valid ? "有效" : "無效"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
