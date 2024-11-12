import React from 'react';
import Lesson from './lesson';

export default function LessonCard({ lessonData }) {
    if (!lessonData) {
        console.error('LessonCard wrapper: lessonData is undefined');
        return null;
    }

    console.log('LessonCard wrapper 收到的數據:', lessonData);
    return <Lesson lessonData={lessonData} />;
}