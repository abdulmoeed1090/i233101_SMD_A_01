// dashboard.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

import { PieChart, LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Math.min(
  Dimensions.get('window').width - 40,
  1100
);

// Assessment weights (keeps in sync with other screens)
const weights = {
  quizzes: 10,
  assignments: 10,
  sessionalI: 15,
  sessionalII: 15,
  project: 10,
  finalExam: 40,
};

export default function DashboardScreen({
  student,
  courses,
  predictedSGPA,
}) {
  // helper to get per-course breakdown values
  const getCourseBreakdown = (course) => {
    if (course.breakdown) return course.breakdown;

    const totalMarks = course.marks || 0;
    const breakdown = {};

    const totalWeight = Object.values(weights).reduce(
      (a, b) => a + b,
      0
    );

    Object.keys(weights).forEach((k) => {
      breakdown[k] =
        Math.round(
          (weights[k] / totalWeight) *
            totalMarks *
            100
        ) / 100;
    });

    return breakdown;
  };

  /*
   * Course-wise progress based on actual marks
   * from Sessional I and Sessional II.
   *
   * Sessional I = 15 marks
   * Sessional II = 15 marks
   * Total = 30 marks
   */
  const courseProgress = courses.map((course) => {
    const breakdown = getCourseBreakdown(course);

    const sessionalI =
      Number(breakdown.sessionalI) || 0;

    const sessionalII =
      Number(breakdown.sessionalII) || 0;

    const obtained =
      sessionalI + sessionalII;

    const possible =
      weights.sessionalI +
      weights.sessionalII;

    const percentage =
      possible > 0
        ? (obtained / possible) * 100
        : 0;

    return {
      code: course.code,
      name: course.name,
      percentage:
        Math.round(percentage * 100) / 100,
    };
  });

  // per-course improvement beforeSI -> afterSI
  const improvementPerCourse = courses.map(
    (course) => {
      const breakdown =
        getCourseBreakdown(course);

      const before = [
        'quizzes',
        'assignments',
      ].reduce(
        (s, k) =>
          s + (Number(breakdown[k]) || 0),
        0
      );

      const after = [
        'quizzes',
        'assignments',
        'sessionalI',
      ].reduce(
        (s, k) =>
          s + (Number(breakdown[k]) || 0),
        0
      );

      const beforePossible = [
        'quizzes',
        'assignments',
      ].reduce(
        (s, k) => s + weights[k],
        0
      );

      const afterPossible = [
        'quizzes',
        'assignments',
        'sessionalI',
      ].reduce(
        (s, k) => s + weights[k],
        0
      );

      const beforePct =
        beforePossible > 0
          ? (before / beforePossible) * 100
          : 0;

      const afterPct =
        afterPossible > 0
          ? (after / afterPossible) * 100
          : 0;

      return {
        code: course.code,
        before:
          Math.round(beforePct * 100) / 100,
        after:
          Math.round(afterPct * 100) / 100,
        diff:
          Math.round(
            (afterPct - beforePct) * 100
          ) / 100,
      };
    }
  );

  // Keep existing GPA prediction exactly as it is
  const predicted = predictedSGPA;

  const lowAttendanceCourses =
    courses.filter(
      (c) => c.attendance < 80
    );

  const isMobile =
    Dimensions.get('window').width < 600;

  const progressChartWidth = Math.max(
    isMobile ? 340 : 500,
    courseProgress.length * 85
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Text style={styles.header}>
        Welcome back, {student.name}
      </Text>

      <View
        style={[
          styles.row,
          isMobile && styles.mobileRow,
        ]}
      >
        <View style={styles.profileCard}>
          <Text style={styles.cardHeader}>
            Student Profile
          </Text>

          <Text style={styles.profileLine}>
            <Text style={styles.meta}>
              Roll:
            </Text>{' '}
            {student.rollNo}
          </Text>

          <Text style={styles.profileLine}>
            <Text style={styles.meta}>
              Section:
            </Text>{' '}
            {student.section}
          </Text>

          <Text style={styles.profileLine}>
            <Text style={styles.meta}>
              CGPA:
            </Text>{' '}
            {student.currentCGPA}
          </Text>

          <Text style={styles.smallNote}>
            Quick actions: Edit profile • Export
            report
          </Text>
        </View>

        <View
          style={[
            styles.metricCard,
            isMobile && styles.mobileMetricCard,
          ]}
        >
          <Text style={styles.metricTitle}>
            Predicted Semester GPA
          </Text>

          <Text style={styles.metricValue}>
            {predicted}
          </Text>

          <Text style={styles.metricSubtitle}>
            Based on calculator inputs (falls back
            to marks)
          </Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.cardHeader}>
          Course-wise Sessional Progress
        </Text>

        <Text style={styles.chartSubtitle}>
          Based on actual Sessional I and Sessional
          II marks
        </Text>

        {typeof BarChart === 'function' ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <BarChart
              data={{
                labels: courseProgress.map(
                  (course) => course.code
                ),
                datasets: [
                  {
                    data: courseProgress.map(
                      (course) =>
                        course.percentage
                    ),
                  },
                ],
              }}
              width={progressChartWidth}
              height={230}
              yAxisSuffix="%"
              fromZero
              chartConfig={chartConfig}
              style={{
                borderRadius: 8,
              }}
              verticalLabelRotation={0}
            />
          </ScrollView>
        ) : (
          <View style={{ padding: 20 }}>
            <Text
              style={{
                color: '#64748b',
              }}
            >
              Bar chart not available on this
              platform.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.courseProgressCard}>
        <Text style={styles.cardHeader}>
          Course Progress
        </Text>

        {courseProgress.map((course) => (
          <View
            key={course.code}
            style={styles.progressItem}
          >
            <View style={styles.progressHeader}>
              <Text style={styles.progressCode}>
                {course.code}
              </Text>

              <Text style={styles.progressValue}>
                {course.percentage}%
              </Text>
            </View>

            <View
              style={
                styles.progressBackground
              }
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${course.percentage}%`,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.cardHeader}>
          Improvement (Before → After Sessional I)
        </Text>

        {typeof BarChart === 'function' ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <BarChart
              data={{
                labels:
                  improvementPerCourse.map(
                    (p) => p.code
                  ),
                datasets: [
                  {
                    data:
                      improvementPerCourse.map(
                        (p) => p.diff
                      ),
                  },
                ],
              }}
              width={Math.max(
                isMobile ? 340 : 500,
                screenWidth
              )}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={-20}
              style={{
                borderRadius: 8,
              }}
            />
          </ScrollView>
        ) : (
          <View style={{ padding: 20 }}>
            <Text
              style={{
                color: '#64748b',
              }}
            >
              Bar chart not available on this
              platform.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardHeader}>
          Academic Alerts & Recommendations
        </Text>

        {lowAttendanceCourses.length > 0 ? (
          lowAttendanceCourses.map((c) => (
            <View
              key={c.id}
              style={styles.alertBox}
            >
              <Text style={styles.alertText}>
                ⚠️ {c.code} attendance is{' '}
                {c.attendance}% — consider attending
                missed sessions.
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.goodText}>
            ✅ All courses above attendance
            threshold.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) =>
    `rgba(37,99,235, ${opacity})`,
  labelColor: (opacity = 1) =>
    `rgba(51,65,85, ${opacity})`,
  style: {
    borderRadius: 8,
  },
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#f8fafc',
  },

  header: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    color: '#0f172a',
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    alignItems: 'stretch',
  },

  mobileRow: {
    flexDirection: 'column',
  },

  profileCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e6eefc',
  },

  metricCard: {
    width: 200,
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mobileMetricCard: {
    width: '100%',
    minHeight: 120,
  },

  cardHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },

  profileLine: {
    color: '#334155',
    marginBottom: 6,
  },

  meta: {
    color: '#475569',
    fontWeight: '700',
  },

  smallNote: {
    marginTop: 8,
    fontSize: 12,
    color: '#64748b',
  },

  metricTitle: {
    color: '#bfdbfe',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  metricValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 6,
  },

  metricSubtitle: {
    color: '#e6f0ff',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },

  chartCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6eefc',
    marginBottom: 12,
    overflow: 'hidden',
  },

  chartSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },

  courseProgressCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6eefc',
    marginBottom: 12,
  },

  progressItem: {
    marginBottom: 14,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  progressCode: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },

  progressValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },

  progressBackground: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
  },

  progressFill: {
    height: 8,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e6eefc',
  },

  alertBox: {
    backgroundColor: '#fff7f0',
    padding: 10,
    borderRadius: 6,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#ffecd1',
  },

  alertText: {
    color: '#92400e',
  },

  goodText: {
    color: '#166534',
  },
});