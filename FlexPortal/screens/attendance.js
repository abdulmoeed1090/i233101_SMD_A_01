import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

import {
  BarChart,
} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function AttendanceScreen({ courses }) {
  const chartWidth = screenWidth - 40;

  const chartData = {
    labels: courses.map((course) => course.code),
    datasets: [
      {
        data: courses.map((course) => course.attendance),
      },
    ],
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.sectionTitle}>
        Attendance Monitoring
      </Text>

      <Text style={styles.subTitle}>
        Attendance percentage for each course
      </Text>

      {/* BAR CHART */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>
          Attendance Overview
        </Text>

        <BarChart
          data={chartData}
          width={chartWidth}
          height={250}
          fromZero={true}
          showValuesOnTopOfBars={true}
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',

            decimalPlaces: 0,

            color: (opacity = 1) =>
              `rgba(37, 99, 235, ${opacity})`,

            labelColor: (opacity = 1) =>
              `rgba(71, 85, 105, ${opacity})`,

            barPercentage: 0.55,

            propsForBackgroundLines: {
              strokeDasharray: '',
              stroke: '#e2e8f0',
              strokeWidth: 1,
            },

            propsForLabels: {
              fontSize: 11,
            },
          }}
          style={styles.chart}
        />
      </View>

      {/* COURSE ATTENDANCE */}
      <Text style={styles.listTitle}>
        Course Attendance
      </Text>

      {courses.map((course) => {
        const isLow = course.attendance < 80;

        return (
          <View
            key={course.id}
            style={[
              styles.card,
              isLow && styles.lowCard,
            ]}
          >
            <View style={styles.rowBetween}>
              <View style={styles.courseInfo}>
                <Text style={styles.codeText}>
                  {course.code}
                </Text>

                <Text style={styles.nameText}>
                  {course.name}
                </Text>
              </View>

              <Text
                style={
                  isLow
                    ? styles.dangerText
                    : styles.successText
                }
              >
                {course.attendance}%
              </Text>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      course.attendance,
                      100
                    )}%`,
                  },
                  isLow && styles.lowProgress,
                ]}
              />
            </View>

            {isLow && (
              <Text style={styles.warningSubtext}>
                ⚠️ Critical: Attendance is below 80%.
              </Text>
            )}

            {!isLow && (
              <Text style={styles.goodSubtext}>
                ✓ Attendance requirement maintained
              </Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 25,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },

  subTitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 14,
  },

  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingTop: 15,
    paddingBottom: 10,
    marginBottom: 18,
    elevation: 2,
  },

  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginLeft: 15,
    marginBottom: 5,
  },

  chart: {
    marginLeft: -10,
    borderRadius: 10,
  },

  listTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 1,
  },

  lowCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  courseInfo: {
    flex: 1,
    paddingRight: 10,
  },

  codeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },

  nameText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
  },

  dangerText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#dc2626',
  },

  successText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#16a34a',
  },

  progressBackground: {
    height: 7,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    marginTop: 12,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 10,
  },

  lowProgress: {
    backgroundColor: '#dc2626',
  },

  warningSubtext: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 7,
    fontWeight: '500',
  },

  goodSubtext: {
    color: '#16a34a',
    fontSize: 12,
    marginTop: 7,
    fontWeight: '500',
  },
});