import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import TeacherStyles from '@/styles/teacherDetail.module.scss';
import TeacherCard from '@/components/TeacherCard';
import ExpandButton from '@/components/button/expand-button';
import Link from 'next/link';
import axios from 'axios';

export default function TeacherDetail({ id }) {
  const [teacher, setTeacher] = useState(null);
  const [otherTeachers, setOtherTeachers] = useState([]);

  useEffect(() => {
    // Fetch teacher details by ID
    axios.get(`http://localhost:3005/api/teacher/teacherDetail/${id}`)
      .then((res) => setTeacher(res.data))
      .catch((error) => console.error("Error fetching teacher details:", error));

    // Fetch other teachers and shuffle for random display
    axios.get('http://localhost:3005/api/teacher')
      .then((res) => {
        const shuffledTeachers = res.data
          .filter(t => t.id !== id) // Exclude the current teacher
          .sort(() => 0.5 - Math.random()); // Shuffle array
        setOtherTeachers(shuffledTeachers.slice(0, 5)); // Take the first 5
      })
      .catch((error) => console.error("Error fetching other teachers:", error));
  }, [id]);

  if (!teacher) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div className={`${TeacherStyles.teacherDetail} container-fluid`}>
        <div className={`${TeacherStyles.btn}`}>
          <Link href="/teacher" passHref>
            <ExpandButton value="返回師資列表" onClick={() => console.log("返回師資列表")} />
          </Link>
        </div>

        {/* Section 1: Teacher Image */}
        <div className={`${TeacherStyles.section1} d-flex justify-content-center align-items-center mt-5`}>
          <div className={`${TeacherStyles.imageBox} ZRT-center`}>
            <img
              src={`/photos/teachers/${teacher.img_path}`}
              alt={teacher.name}
              className="img-fluid rounded"
            />
          </div>
        </div>

        {/* Section 2: Teacher's Info */}
        <div className={`${TeacherStyles.section2} container-fluid justify-content-center align-items-center`}>
          <div className='container'>
            <div className="row gy-4 mt-1">
              <div className={`${TeacherStyles.textBox} col-sm-6 col-md-4 col-lg-3 px-4 text-left d-flex flex-column`}>
                <h2>{teacher.name}</h2>
                <p>{teacher.description}</p>
              </div>
              <div className={`${TeacherStyles.textBox} col-sm-6 col-md-4 col-lg-3 px-4 text-left d-flex flex-column`}>
                <p>{teacher.experience}</p>
              </div>
              <div className={`${TeacherStyles.textBox} col-sm-6 col-md-4 col-lg-3 px-4 text-left d-flex flex-column`}>
                <p>{teacher.awards}</p>
              </div>
              <div className={`${TeacherStyles.textBox} col-sm-6 col-md-4 col-lg-3 px-4 text-left d-flex flex-column`}>
                <p>{teacher.education}</p>
              </div>
            </div>
          </div>

          {/* Section: Other Teachers */}
          <div className="container py-5">
            <h3 className="text-center mb-4">其他老師</h3>
            <div className="row d-flex row-cols-1 row-cols-sm-2 row-cols-lg-4 row-cols-xl-5 gy-4 justify-content-center">
              {otherTeachers.map((otherTeacher) => (
                <div
                  className="col mb-4 d-flex align-items-center justify-content-center"
                  key={otherTeacher.id}
                >
                  <TeacherCard teacher={otherTeacher} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer bgColor="#FFC5BF" />
    </>
  );
}

// For server-side fetching the ID parameter
export async function getServerSideProps(context) {
  const { id } = context.query;
  return { props: { id } };
}
