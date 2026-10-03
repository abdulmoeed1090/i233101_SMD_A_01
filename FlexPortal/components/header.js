import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function Header({ currentView, setView }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'marks', label: 'Marks' },
    { id: 'calculator', label: 'GPA Calc' },
    { id: 'feedback', label: 'Feedback' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FLEX Portal</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.btn, currentView === tab.id && styles.activeBtn]}
            onPress={() => setView(tab.id)}
          >
            <Text style={styles.btnText}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 45, paddingBottom: 10, backgroundColor: '#0f172a', alignItems: 'center' },
  title: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  navRow: { marginTop: 12, paddingHorizontal: 10 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, marginHorizontal: 3, borderRadius: 6, backgroundColor: '#1e293b' },
  activeBtn: { backgroundColor: '#2563eb' },
  btnText: { color: '#ffffff', fontWeight: '600', fontSize: 13 },
});