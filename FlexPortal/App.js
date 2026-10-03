
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import Header from './components/header';
import DashboardScreen from './screens/dashboard';
import AttendanceScreen from './screens/attendance';
import MarksScreen from './screens/marks';
import CalculatorScreen from './screens/calculator';
import FeedbackScreen from './screens/feedback';

const assessmentConfig = [
  { key: 'quizzes', label: 'Quizzes', weight: 10 },
  { key: 'assignments', label: 'Assignments', weight: 10 },
  { key: 'sessionalI', label: 'Sessional I', weight: 15 },
  { key: 'sessionalII', label: 'Sessional II', weight: 15 },
  { key: 'project', label: 'Project', weight: 10 },
  { key: 'finalExam', label: 'Final Exam', weight: 40 },
];

const initialStudent = {
  name: 'Abdul Moeed',
  rollNo: 'i23-3101',
  section: 'BS-SE-7A',
  currentCGPA: 3.42,
  completedCredits: 80,
  email: 'i233101@isb.nu.edu.pk',
  phone: '+92 300 1234567',
};

const getBreakdownTotal = (breakdown = {}) =>
  Object.values(breakdown).reduce(
    (sum, value) =>
      sum + (value === 'pending' ? 0 : Number(value) || 0),
    0
  );

const initialCourses = [
  {
    id: '1',
    code: 'CS3001',
    name: 'Software for Mobile Devices',
    marks: 52,
    attendance: 100,
    credits: 3,
    inputGpa: '',
    breakdown: {
      quizzes: 8,
      assignments: 9,
      sessionalI: 13,
      sessionalII: 14,
      project: 8,
      finalExam: 'pending',
    },
  },

  {
    id: '2',
    code: 'CS3002',
    name: 'Computer Vision',
    marks: 49,
    attendance: 88,
    credits: 3,
    inputGpa: '',
    breakdown: {
      quizzes: 7,
      assignments: 8,
      sessionalI: 12,
      sessionalII: 13,
      project: 9,
      finalExam: 'pending',
    },
  },

  {
    id: '3',
    code: 'CS3003',
    name: 'Deep Learning',
    marks: 42,
    attendance: 92,
    credits: 3,
    inputGpa: '',
    breakdown: {
      quizzes: 6,
      assignments: 7,
      sessionalI: 10,
      sessionalII: 11,
      project: 8,
      finalExam: 'pending',
    },
  },

  {
    id: '4',
    code: 'CS3004',
    name: 'Formal Methods',
    marks: 37,
    attendance: 70,
    credits: 3,
    inputGpa: '',
    breakdown: {
      quizzes: 5,
      assignments: 6,
      sessionalI: 9,
      sessionalII: 10,
      project: 7,
      finalExam: 'pending',
    },
  },
];

export default function App() {
  const [currentView, setView] = useState('dashboard');

  const [student] = useState(initialStudent);

  const [courses, setCourses] = useState(initialCourses);

  // -----------------------------------------
  // Grade calculation
  // -----------------------------------------

  const getGradeInfo = (marks) => {
    if (marks >= 85) return { letter: 'A', gpa: 4.0 };
    if (marks >= 80) return { letter: 'A-', gpa: 3.67 };
    if (marks >= 75) return { letter: 'B+', gpa: 3.33 };
    if (marks >= 71) return { letter: 'B', gpa: 3.0 };
    if (marks >= 68) return { letter: 'B-', gpa: 2.67 };
    if (marks >= 64) return { letter: 'C+', gpa: 2.33 };
    if (marks >= 60) return { letter: 'C', gpa: 2.0 };
    if (marks >= 50) return { letter: 'D', gpa: 1.0 };

    return { letter: 'F', gpa: 0.0 };
  };

  // -----------------------------------------
  // Predicted marks
  // -----------------------------------------

  const getPredictedMarks = (course) => {
    const finalMark = course.breakdown.finalExam;

    // Final marks already uploaded
    if (finalMark !== 'pending') {
      return course.marks;
    }

    // Only the completed 60% is available
    const completedMarks = getBreakdownTotal({
      ...course.breakdown,
      finalExam: 0,
    });

    const completedWeight = 60;

    if (completedWeight === 0) {
      return 0;
    }

    // Example:
    // 52 / 60 * 100 = 86.67%
    return (completedMarks / completedWeight) * 100;
  };

  // -----------------------------------------
  // Predicted GPA
  // -----------------------------------------

  const getCoursePredictedGPA = (course) => {
    const predictedMarks = getPredictedMarks(course);

    return getGradeInfo(predictedMarks).gpa;
  };

  // -----------------------------------------
  // Change marks
  // -----------------------------------------

  const handleBreakdownChange = (id, field, val) => {
    // Allow final marks to be pending
    if (field === 'finalExam' && val === 'pending') {
      setCourses((prevCourses) =>
        prevCourses.map((course) => {
          if (course.id !== id) return course;

          const updatedBreakdown = {
            ...course.breakdown,
            finalExam: 'pending',
          };

          return {
            ...course,
            breakdown: updatedBreakdown,
            marks: getBreakdownTotal(updatedBreakdown),
          };
        })
      );

      return;
    }

    const nextValue = Number(val) || 0;

    const maxValue =
      assessmentConfig.find(
        (item) => item.key === field
      )?.weight ?? 100;

    const clampedValue = Math.min(
      maxValue,
      Math.max(0, nextValue)
    );

    setCourses((prevCourses) =>
      prevCourses.map((course) => {
        if (course.id !== id) {
          return course;
        }

        const updatedBreakdown = {
          ...course.breakdown,
          [field]: clampedValue,
        };

        return {
          ...course,
          breakdown: updatedBreakdown,
          marks: getBreakdownTotal(updatedBreakdown),
        };
      })
    );
  };

  // -----------------------------------------
  // Calculator GPA input
  // -----------------------------------------

  const handleCalculatorGpaChange = (id, val) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === id
          ? {
              ...course,
              inputGpa: val,
            }
          : course
      )
    );
  };

  // -----------------------------------------
  // Semester credits
  // -----------------------------------------

  const currentSemesterCredits = courses.reduce(
    (sum, course) => sum + course.credits,
    0
  );

  // -----------------------------------------
  // Dashboard predicted SGPA
  // -----------------------------------------

  const totalPredictedPoints = courses.reduce(
    (sum, course) => {
      const predictedGPA =
        getCoursePredictedGPA(course);

      return (
        sum +
        predictedGPA * course.credits
      );
    },
    0
  );

  const predictedSGPA =
    currentSemesterCredits > 0
      ? (
          totalPredictedPoints /
          currentSemesterCredits
        ).toFixed(2)
      : '0.00';

  // -----------------------------------------
  // Calculator SGPA
  //
  // If GPA input exists:
  //     use entered GPA
  //
  // Otherwise:
  //     use predicted GPA
  // -----------------------------------------

  const totalCalcPoints = courses.reduce(
    (sum, course) => {
      const enteredGPA =
        parseFloat(course.inputGpa);

      const gpa = Number.isNaN(enteredGPA)
        ? getCoursePredictedGPA(course)
        : enteredGPA;

      return (
        sum +
        gpa * course.credits
      );
    },
    0
  );

  const calculatedSGPA =
    currentSemesterCredits > 0
      ? (
          totalCalcPoints /
          currentSemesterCredits
        ).toFixed(2)
      : '0.00';

  // -----------------------------------------
  // CGPA
  // -----------------------------------------

  const totalCumulativeCredits =
    student.completedCredits +
    currentSemesterCredits;

  const previousTotalPoints =
    student.currentCGPA *
    student.completedCredits;

  const calculatedCGPA =
    totalCumulativeCredits > 0
      ? (
          (
            previousTotalPoints +
            totalCalcPoints
          ) /
          totalCumulativeCredits
        ).toFixed(2)
      : '0.00';

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <View style={styles.container}>

      <Header
        currentView={currentView}
        setView={setView}
      />

      <ScrollView
        contentContainerStyle={styles.content}
      >

        {currentView === 'dashboard' && (
          <DashboardScreen
            student={student}
            courses={courses}
            predictedSGPA={predictedSGPA}
            getPredictedMarks={getPredictedMarks}
            getGradeInfo={getGradeInfo}
          />
        )}

        {currentView === 'attendance' && (
          <AttendanceScreen
            courses={courses}
          />
        )}

        {currentView === 'marks' && (
          <MarksScreen
            courses={courses}
            onBreakdownChange={handleBreakdownChange}
            getGradeInfo={getGradeInfo}
            getPredictedMarks={getPredictedMarks}
          />
        )}

        {currentView === 'calculator' && (
          <CalculatorScreen
            courses={courses}
            onGpaChange={handleCalculatorGpaChange}
            calculatedSGPA={calculatedSGPA}
            calculatedCGPA={calculatedCGPA}
            getPredictedMarks={getPredictedMarks}
            getGradeInfo={getGradeInfo}
          />
        )}

        {currentView === 'feedback' && (
          <FeedbackScreen
            courses={courses}
          />
        )}

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  content: {
    padding: 15,
  },
});

