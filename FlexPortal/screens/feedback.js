import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

const feedbackGroups = [
  {
    id: 'g1',
    title: 'Group 1: Teaching & Pedagogy',
    options: ['Poor', 'Average', 'Good', 'Excellent'],
    questions: [
      'Instructor clarity in explanations',
      'Punctuality and lecture delivery',
      'Encouragement of interactive discussion',
      'Availability during office hours',
      'Pacing of the lectures',
    ],
  },
  {
    id: 'g2',
    title: 'Group 2: Course Content & Material',
    options: ['Poor', 'Average', 'Good', 'Excellent'],
    questions: [
      'Relevance of course materials to objectives',
      'Quality of slides, codes, and reading notes',
      'Clarity of lab and project specifications',
      'Coverage of practical/real-world applications',
      'Organization of topics across weeks',
    ],
  },
  {
    id: 'g3',
    title: 'Group 3: Assignments & Workload',
    options: ['Very High', 'High', 'Moderate', 'Low'],
    questions: [
      'Appropriateness of homework difficulty',
      'Clarity of submission deadlines',
      'Balance of weekly workload',
      'Usefulness of feedback on assignments',
      'Fairness of grading timelines',
    ],
  },
  {
    id: 'g4',
    title: 'Group 4: Quizzes & Examinations',
    options: ['Unfair', 'Satisfactory', 'Fair', 'Very Fair'],
    questions: [
      'Alignment of exams with lectures',
      'Clarity of question statements',
      'Fairness of overall assessment scheme',
      'Quality of exam preparation resources',
      'Feedback provided after quizzes',
    ],
  },
];

export default function FeedbackScreen({ courses }) {
  const [selectedCourse, setSelectedCourse] = useState(courses[0].id);
  const [answers, setAnswers] = useState({});

  const handleSelectOption = (groupKey, questionIdx, option) => {
    setAnswers((prev) => ({
      ...prev,
      [`${selectedCourse}_${groupKey}_q${questionIdx}`]: option,
    }));
  };

  const handleSubmit = () => {
    Alert.alert('Success', 'Feedback submitted successfully for this course!');
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Course Feedback</Text>
      
      {/* Course Selection Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.courseRow}>
        {courses.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.courseTab, selectedCourse === c.id && styles.activeCourseTab]}
            onPress={() => setSelectedCourse(c.id)}
          >
            <Text style={[styles.courseTabText, selectedCourse === c.id && styles.activeCourseTabText]}>
              {c.code}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Render Feedback Question Groups */}
      {feedbackGroups.map((group) => (
        <View key={group.id} style={styles.groupCard}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          
          {/* Rating Scale Legend Header */}
          <View style={styles.optionsHeader}>
            <Text style={styles.legendText}>Rating Options: {group.options.join(' | ')}</Text>
          </View>

          {group.questions.map((qText, qIdx) => {
            const currentAnswerKey = `${selectedCourse}_${group.id}_q${qIdx}`;
            const selectedOpt = answers[currentAnswerKey];

            return (
              <View key={qIdx} style={styles.questionBlock}>
                <Text style={styles.questionText}>
                  {qIdx + 1}. {qText}
                </Text>
                
                {/* Compact Horizontal MCQ Option Selection */}
                <View style={styles.optionsRow}>
                  {group.options.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.optBtn,
                        selectedOpt === opt && styles.optBtnSelected,
                      ]}
                      onPress={() => handleSelectOption(group.id, qIdx, opt)}
                    >
                      <Text style={[styles.optText, selectedOpt === opt && styles.optTextSelected]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      ))}

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Submit Feedback</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 10 },
  courseRow: { marginBottom: 12 },
  courseTab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6, backgroundColor: '#e2e8f0', marginRight: 8 },
  activeCourseTab: { backgroundColor: '#2563eb' },
  courseTabText: { fontWeight: 'bold', color: '#334155', fontSize: 13 },
  activeCourseTabText: { color: '#ffffff' },
  groupCard: { backgroundColor: '#ffffff', padding: 14, borderRadius: 8, marginBottom: 12, elevation: 1 },
  groupTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  optionsHeader: { backgroundColor: '#f1f5f9', padding: 6, borderRadius: 4, marginBottom: 10 },
  legendText: { fontSize: 12, color: '#475569', fontWeight: '600' },
  questionBlock: { marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f8fafc', paddingBottom: 8 },
  questionText: { fontSize: 13, color: '#1e293b', marginBottom: 6, fontWeight: '500' },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  optBtn: { flex: 1, paddingVertical: 6, marginHorizontal: 2, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 4, alignItems: 'center' },
  optBtnSelected: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  optText: { fontSize: 11, color: '#475569', fontWeight: '500' },
  optTextSelected: { color: '#ffffff', fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#16a34a', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8, marginBottom: 30 },
  submitBtnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});