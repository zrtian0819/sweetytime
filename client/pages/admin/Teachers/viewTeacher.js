import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Modal from '@/components/adminModal';
import axios from 'axios';

export default function TeacherDetail() {
  const [teacher, setTeacher] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3005/api/teacher/teacherDetail/${id}`)
        .then((res) => setTeacher(res.data))
        .catch((error) => console.error('無法獲取教師資料:', error));
    }
  }, [id]);

  if (!teacher) return <div>Loading...</div>;

  return (
    <AdminLayout>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={teacher.name}
        confirmText="關閉"
        onConfirm={() => setShowModal(false)}
      >
        <div style={{ padding: '20px', maxWidth: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Image
              src={`/photos/teachers/${teacher.img_path || 'default.jpg'}`}
              width={300}
              height={300}
              alt={`${teacher.name}的圖片`}
            />
          </div>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{teacher.name}</h2>
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
      </Modal>
    </AdminLayout>
  );
}
