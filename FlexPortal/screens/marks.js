// marks.js
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';

const assessmentConfig = [
  { key: 'quizzes', label: 'Quizzes', weight: 10 },
  { key: 'assignments', label: 'Assignments', weight: 10 },
  { key: 'sessionalI', label: 'Sessional I', weight: 15 },
  { key: 'sessionalII', label: 'Sessional II', weight: 15 },
  { key: 'project', label: 'Project', weight: 10 },
  { key: 'finalExam', label: 'Final Exam', weight: 40 },
];

const getCourseTotal = (course) =>
  course.breakdown
    ? Object.values(course.breakdown).reduce(
        (sum, value) => sum + (Number(value) || 0),
        0
      )
    : Number(course.marks) || 0;

const getBeforeFinalTotal = (course) => {
  const breakdown = course.breakdown || {};

  return [
    'quizzes',
    'assignments',
    'sessionalI',
    'sessionalII',
    'project',
  ].reduce(
    (sum, key) => sum + (Number(breakdown[key]) || 0),
    0
  );
};

const getBeforeFinalPossible = () =>
  assessmentConfig
    .filter((item) => item.key !== 'finalExam')
    .reduce((sum, item) => sum + item.weight, 0);

export default function MarksScreen({
  courses,
  onBreakdownChange,
  getGradeInfo,
}) {
  const [expandedCourseId, setExpandedCourseId] =
    useState(courses[0]?.id ?? null);

  const toggleCourse = (courseId) => {
    setExpandedCourseId((currentId) =>
      currentId === courseId ? null : courseId
    );
  };

  return (
    <View>
      <Text style={styles.eyebrow}>
        ACADEMIC PERFORMANCE
      </Text>

      <Text style={styles.sectionTitle}>
        Course Marks
      </Text>

      <Text style={styles.subTitle}>
        Review your marks and predicted grade for each course.
      </Text>

      <View style={styles.breakdownCard}>
        <Text style={styles.breakdownTitle}>
          Marks Breakdown
        </Text>

        <Text style={styles.breakdownSubtitle}>
          Assessment weights add up to 100 marks
        </Text>

        <View style={styles.breakdownGrid}>
          {assessmentConfig.map((item) => (
            <View
              key={item.key}
              style={styles.breakdownItem}
            >
              <Text style={styles.breakdownName}>
                {item.label}
              </Text>

              <Text style={styles.breakdownValue}>
                {item.weight}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {courses.map((course) => {
        const finalMarks =
          course.breakdown?.finalExam;

        const hasFinalMarks =
          finalMarks !== undefined &&
          finalMarks !== null &&
          String(finalMarks).trim() !== '' &&
          Number(finalMarks) > 0;

        const totalMarks = hasFinalMarks
          ? getCourseTotal(course)
          : null;

        const beforeFinalTotal =
          getBeforeFinalTotal(course);

        const beforeFinalPossible =
          getBeforeFinalPossible();

        const beforeFinalPercentage =
          beforeFinalPossible > 0
            ? (beforeFinalTotal /
                beforeFinalPossible) *
              100
            : 0;

        const grade = hasFinalMarks
          ? getGradeInfo(totalMarks)
          : null;

        const isExpanded =
          expandedCourseId === course.id;

        return (
          <Pressable
            key={course.id}
            style={styles.card}
            onPress={() => toggleCourse(course.id)}
          >
            <View style={styles.courseHeading}>
              <View style={styles.courseIdentity}>
                <Text style={styles.codeText}>
                  {course.code}
                </Text>

                <Text style={styles.nameText}>
                  {course.name}
                </Text>
              </View>

              <View style={styles.creditBadge}>
                <Text style={styles.creditText}>
                  {course.credits} CR
                </Text>
              </View>
            </View>

            {hasFinalMarks ? (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Total marks (out of 100)
                  </Text>

                  <Text style={styles.textInput}>
                    {totalMarks}
                  </Text>
                </View>

                <View style={styles.rowBetween}>
                  <View style={styles.gradeBadge}>
                    <Text style={styles.resultText}>
                      Grade {grade.letter}
                    </Text>
                  </View>

                  <Text style={styles.pointsText}>
                    {grade.gpa.toFixed(2)}{' '}
                    <Text style={styles.pointsCaption}>
                      grade points
                    </Text>
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.pendingContainer}>
                <Text style={styles.pendingText}>
                  Final Exam marks not uploaded yet
                </Text>

                <View style={styles.pendingResult}>
                  <Text style={styles.pendingLabel}>
                    Obtained before Final
                  </Text>

                  <Text style={styles.pendingValue}>
                    {beforeFinalTotal.toFixed(2)} /{' '}
                    {beforeFinalPossible}
                  </Text>
                </View>

                <View style={styles.pendingResult}>
                  <Text style={styles.pendingLabel}>
                    Percentage
                  </Text>

                  <Text style={styles.pendingPercentage}>
                    {beforeFinalPercentage.toFixed(2)}%
                  </Text>
                </View>
              </View>
            )}

            {isExpanded && (
              <View style={styles.expandedBreakdown}>
                {assessmentConfig.map((item) => (
                  <View
                    key={`${course.id}-${item.key}`}
                    style={styles.breakdownRow}
                  >
                    <Text style={styles.breakdownRowLabel}>
                      {item.label}
                    </Text>

                    <TextInput
                      style={styles.breakdownInput}
                      keyboardType="numeric"
                      value={String(
                        course.breakdown?.[item.key] ?? ''
                      )}
                      onChangeText={(val) =>
                        onBreakdownChange(
                          course.id,
                          item.key,
                          val
                        )
                      }
                      maxLength={2}
                    />
                  </View>
                ))}
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#2563eb',
    marginBottom: 5,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },

  subTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 18,
  },

  breakdownCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#dbeafe',
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },

  breakdownTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },

  breakdownSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 3,
    marginBottom: 12,
  },

  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  breakdownItem: {
    width: '31%',
    minHeight: 62,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
    justifyContent: 'space-between',
  },

  breakdownName: {
    fontSize: 11,
    color: '#64748b',
  },

  breakdownValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1d4ed8',
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },

  courseHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  courseIdentity: {
    flex: 1,
    paddingRight: 8,
  },

  codeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
    letterSpacing: 0.4,
  },

  nameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 4,
  },

  creditBadge: {
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  creditText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '700',
  },

  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },

  textInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    borderRadius: 9,
    paddingVertical: 7,
    paddingHorizontal: 12,
    minWidth: 70,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  gradeBadge: {
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  resultText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1d4ed8',
  },

  pointsText: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 15,
  },

  pointsCaption: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '500',
  },

  pendingContainer: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },

  pendingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 10,
  },

  pendingResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },

  pendingLabel: {
    fontSize: 12,
    color: '#64748b',
  },

  pendingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },

  pendingPercentage: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563eb',
  },

  expandedBreakdown: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
  },

  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  breakdownRowLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },

  breakdownInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: 64,
    paddingVertical: 6,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
});