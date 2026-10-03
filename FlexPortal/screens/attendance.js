import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AttendanceScreen({ courses }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Attendance Monitoring</Text>
      {courses.map((course) => {
        const isLow = course.attendance < 80;
        return (
          <View key={course.id} style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.codeText}>{course.code}</Text>
              <Text style={isLow ? styles.dangerText : styles.successText}>
                {course.attendance}%
              </Text>
            </View>
            <Text style={styles.nameText}>{course.name}</Text>
            {isLow && (
              <Text style={styles.warningSubtext}>
                ⚠️ Critical: Attendance is below 80%.
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  card: { backgroundColor: '#ffffff', padding: 15, borderRadius: 8, marginBottom: 12, elevation: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  codeText: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  nameText: { fontSize: 13, color: '#64748b', marginTop: 2 },
  dangerText: { fontSize: 16, fontWeight: 'bold', color: '#dc2626' },
  successText: { fontSize: 16, fontWeight: 'bold', color: '#16a34a' },
  warningSubtext: { color: '#dc2626', fontSize: 12, marginTop: 6, fontWeight: '500' },
});