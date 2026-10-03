import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { PieChart, LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Math.min(Dimensions.get('window').width - 40, 1100);

// Assessment weights (keeps in sync with other screens)
const weights = {
  quizzes: 10,
  assignments: 10,
  sessionalI: 15,
  sessionalII: 15,
  project: 10,
  finalExam: 40,
};

export default function DashboardScreen({ student, courses }) {
  // helper to get per-course breakdown values (fallback to proportional split if missing)
  const getCourseBreakdown = (course) => {
    if (course.breakdown) return course.breakdown;
    // distribute course.marks proportionally to weights
    const totalMarks = course.marks || 0;
    const breakdown = {};
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    Object.keys(weights).forEach((k) => {
      breakdown[k] = Math.round((weights[k] / totalWeight) * totalMarks * 100) / 100;
    });
    return breakdown;
  };

  // stages for progress tracking
  const stages = [
    { key: 'beforeSI', label: 'Before Sessional I', keys: ['quizzes', 'assignments'] },
    { key: 'afterSI', label: 'After Sessional I', keys: ['quizzes', 'assignments', 'sessionalI'] },
    { key: 'afterSII', label: 'After Sessional II', keys: ['quizzes', 'assignments', 'sessionalI', 'sessionalII', 'project'] },
    { key: 'final', label: 'Final', keys: ['quizzes', 'assignments', 'sessionalI', 'sessionalII', 'project', 'finalExam'] },
  ];

  // compute average percent achieved at each stage across courses
  const stageAverages = stages.map((stage) => {
    const perCoursePercents = courses.map((course) => {
      const breakdown = getCourseBreakdown(course);
      const obtained = stage.keys.reduce((s, k) => s + (Number(breakdown[k]) || 0), 0);
      const possible = stage.keys.reduce((s, k) => s + weights[k], 0);
      return possible > 0 ? (obtained / possible) * 100 : 0;
    });
    const avg = perCoursePercents.reduce((a, b) => a + b, 0) / (perCoursePercents.length || 1);
    return Math.round(avg * 100) / 100;
  });

  // per-course improvement beforeSI -> afterSI (percent points)
  const improvementPerCourse = courses.map((course) => {
    const breakdown = getCourseBreakdown(course);
    const before = ['quizzes', 'assignments'].reduce((s, k) => s + (Number(breakdown[k]) || 0), 0);
    const after = ['quizzes', 'assignments', 'sessionalI'].reduce((s, k) => s + (Number(breakdown[k]) || 0), 0);
    const beforePossible = ['quizzes', 'assignments'].reduce((s, k) => s + weights[k], 0);
    const afterPossible = ['quizzes', 'assignments', 'sessionalI'].reduce((s, k) => s + weights[k], 0);
    const beforePct = beforePossible > 0 ? (before / beforePossible) * 100 : 0;
    const afterPct = afterPossible > 0 ? (after / afterPossible) * 100 : 0;
    return { code: course.code, before: Math.round(beforePct * 100) / 100, after: Math.round(afterPct * 100) / 100, diff: Math.round((afterPct - beforePct) * 100) / 100 };
  });

  // attendance pie chart data
  const pieChartData = courses.map((c, idx) => ({
    name: c.code,
    population: c.attendance,
    color: c.attendance < 80 ? '#ef4444' : ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'][idx % 4],
    legendFontColor: '#334155',
    legendFontSize: 12,
  }));

  // compute quick SGPA from inputGpa fallback to marks->grade
  const getGradeInfo = (marks) => {
    if (marks >= 85) return 4.0;
    if (marks >= 80) return 3.67;
    if (marks >= 75) return 3.33;
    if (marks >= 71) return 3.0;
    if (marks >= 68) return 2.67;
    if (marks >= 64) return 2.33;
    if (marks >= 60) return 2.0;
    if (marks >= 50) return 1.0;
    return 0.0;
  };

  const currentSemesterCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const totalPointsThisSem = courses.reduce((sum, c) => {
    const parsedInputGpa = c.inputGpa != null ? parseFloat(c.inputGpa) : NaN;
    const courseGpa = !isNaN(parsedInputGpa) ? parsedInputGpa : getGradeInfo(c.marks);
    return sum + courseGpa * c.credits;
  }, 0);
  const predictedSGPA = currentSemesterCredits > 0 ? (totalPointsThisSem / currentSemesterCredits).toFixed(2) : '0.00';

  const lowAttendanceCourses = courses.filter((c) => c.attendance < 80);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Welcome back, {student.name}</Text>

      <View style={styles.row}>
        <View style={styles.profileCard}>
          <Text style={styles.cardHeader}>Student Profile</Text>
          <Text style={styles.profileLine}><Text style={styles.meta}>Roll:</Text> {student.rollNo}</Text>
          <Text style={styles.profileLine}><Text style={styles.meta}>Section:</Text> {student.section}</Text>
          <Text style={styles.profileLine}><Text style={styles.meta}>CGPA:</Text> {student.currentCGPA}</Text>
          <Text style={styles.smallNote}>Quick actions: Edit profile • Export report</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Predicted Semester GPA</Text>
          <Text style={styles.metricValue}>{predictedSGPA}</Text>
          <Text style={styles.metricSubtitle}>Based on calculator inputs (falls back to marks)</Text>
        </View>
      </View>

      <View style={styles.chartsRow}>
        <View style={styles.chartCard}>
          <Text style={styles.cardHeader}>Progress Across Assessment Stages</Text>
          <LineChart
            data={{ labels: stages.map((s) => s.label), datasets: [{ data: stageAverages }] }}
            width={screenWidth * 0.6}
            height={220}
            yAxisSuffix="%"
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 8 }}
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.cardHeader}>Attendance Distribution</Text>
          <PieChart
            data={pieChartData}
            width={screenWidth * 0.35}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="-10"
            style={{ alignSelf: 'center' }}
          />
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.cardHeader}>Improvement (Before → After Sessional I)</Text>
        <BarChart
          data={{ labels: improvementPerCourse.map((p) => p.code), datasets: [{ data: improvementPerCourse.map((p) => p.diff) }] }}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={-20}
          style={{ borderRadius: 8 }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardHeader}>Academic Alerts & Recommendations</Text>
        {lowAttendanceCourses.length > 0 ? (
          lowAttendanceCourses.map((c) => (
            <View key={c.id} style={styles.alertBox}>
              <Text style={styles.alertText}>⚠️ {c.code} attendance is {c.attendance}% — consider attending missed sessions.</Text>
            </View>
          ))
        ) : (
          <Text style={styles.goodText}>✅ All courses above attendance threshold.</Text>
        )}
      </View>

    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(37,99,235, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(51,65,85, ${opacity})`,
  style: { borderRadius: 8 },
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, backgroundColor: '#f8fafc' },
  header: { fontSize: 22, fontWeight: '800', marginBottom: 12, color: '#0f172a' },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  profileCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 10, elevation: 2, borderWidth: 1, borderColor: '#e6eefc' },
  metricCard: { width: 200, backgroundColor: '#2563eb', padding: 16, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardHeader: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  profileLine: { color: '#334155', marginBottom: 6 },
  meta: { color: '#475569', fontWeight: '700' },
  smallNote: { marginTop: 8, fontSize: 12, color: '#64748b' },
  metricTitle: { color: '#bfdbfe', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  metricValue: { color: '#fff', fontSize: 28, fontWeight: '900', marginTop: 6 },
  metricSubtitle: { color: '#e6f0ff', fontSize: 12, marginTop: 6 },
  chartsRow: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  chartCard: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e6eefc' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#e6eefc' },
  alertBox: { backgroundColor: '#fff7f0', padding: 10, borderRadius: 6, marginVertical: 6, borderWidth: 1, borderColor: '#ffecd1' },
  alertText: { color: '#92400e' },
  goodText: { color: '#166534' },
});