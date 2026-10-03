
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

export default function CalculatorScreen({
  courses,
  onGpaChange,
  calculatedSGPA,
  calculatedCGPA,
  getPredictedMarks,
  getGradeInfo,
}) {
  return (
    <View>

      <Text style={styles.sectionTitle}>
        SGPA & CGPA Calculator
      </Text>

      <Text style={styles.subTitle}>
        Enter your expected GPA for each course.
        Leave empty to use the predicted GPA.
      </Text>

      {courses.map((course) => {

        const predictedMarks =
          getPredictedMarks(course);

        const predictedGrade =
          getGradeInfo(predictedMarks);

        const finalPending =
          course.breakdown.finalExam === 'pending';

        const hasEnteredGPA =
          course.inputGpa !== '' &&
          !Number.isNaN(
            parseFloat(course.inputGpa)
          );

        return (
          <View
            key={course.id}
            style={styles.card}
          >

            {/* Course information */}

            <View style={styles.rowBetween}>

              <View style={styles.courseInfo}>

                <Text style={styles.codeText}>
                  {course.code}
                </Text>

                <Text style={styles.nameText}>
                  {course.name}
                </Text>

                <Text style={styles.creditText}>
                  {course.credits} Credit Hours
                </Text>

              </View>

              {/* GPA input */}

              <View style={styles.inputBoxRow}>

                <Text style={styles.label}>
                  GPA:
                </Text>

                <TextInput
                  style={styles.smallInput}
                  keyboardType="numeric"
                  placeholder={predictedGrade.gpa.toFixed(2)}
                  value={course.inputGpa}
                  onChangeText={(val) => {

                    const num =
                      parseFloat(val);

                    // Allow empty input
                    if (val === '') {
                      onGpaChange(
                        course.id,
                        ''
                      );
                      return;
                    }

                    // Maximum GPA = 4
                    if (num > 4) {
                      onGpaChange(
                        course.id,
                        '4'
                      );
                      return;
                    }

                    // Minimum GPA = 0
                    if (num < 0) {
                      onGpaChange(
                        course.id,
                        '0'
                      );
                      return;
                    }

                    onGpaChange(
                      course.id,
                      val
                    );
                  }}
                />

              </View>

            </View>

            {/* Prediction */}

            <View style={styles.predictionBox}>

              <Text style={styles.predictionTitle}>

                {finalPending
                  ? 'Predicted Result'
                  : 'Final Result'}

              </Text>

              <View style={styles.predictionRow}>

                <Text style={styles.predictionLabel}>
                  Percentage
                </Text>

                <Text style={styles.predictionValue}>
                  {predictedMarks.toFixed(2)}%
                </Text>

              </View>

              <View style={styles.predictionRow}>

                <Text style={styles.predictionLabel}>
                  Grade
                </Text>

                <Text style={styles.predictionValue}>
                  {predictedGrade.letter}
                </Text>

              </View>

              <View style={styles.predictionRow}>

                <Text style={styles.predictionLabel}>
                  Predicted GPA
                </Text>

                <Text style={styles.predictionValue}>
                  {predictedGrade.gpa.toFixed(2)}
                </Text>

              </View>

              {/* Show which GPA is being used */}

              {hasEnteredGPA ? (

                <Text style={styles.enteredText}>
                  ✓ Entered GPA {course.inputGpa} is
                  being used in SGPA & CGPA.
                </Text>

              ) : (

                <Text style={styles.pendingText}>
                  {finalPending
                    ? 'No GPA entered. Predicted GPA is being used.'
                    : 'No GPA entered. Final GPA is being used.'}
                </Text>

              )}

            </View>

          </View>
        );
      })}

      {/* Final calculation */}

      <View style={styles.resultCard}>

        <View style={styles.infoRow}>

          <Text style={styles.resultCardLabel}>
            Calculated Semester GPA (SGPA):
          </Text>

          <Text style={styles.resultCardValue}>
            {calculatedSGPA}
          </Text>

        </View>

        <View style={styles.infoRow}>

          <Text style={styles.resultCardLabel}>
            Updated Cumulative GPA (CGPA):
          </Text>

          <Text style={styles.resultCardValue}>
            {calculatedCGPA}
          </Text>

        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },

  subTitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
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
    marginTop: 2,
  },

  creditText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },

  label: {
    fontSize: 14,
    color: '#475569',
  },

  inputBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  smallInput: {
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 6,
    padding: 6,
    width: 60,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },

  predictionBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 7,
    padding: 10,
    marginTop: 12,
  },

  predictionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 6,
  },

  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },

  predictionLabel: {
    fontSize: 13,
    color: '#64748b',
  },

  predictionValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },

  pendingText: {
    fontSize: 11,
    color: '#f59e0b',
    marginTop: 7,
  },

  enteredText: {
    fontSize: 11,
    color: '#16a34a',
    marginTop: 7,
    fontWeight: '600',
  },

  resultCard: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },

  resultCardLabel: {
    color: '#94a3b8',
    fontSize: 14,
    flex: 1,
  },

  resultCardValue: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: 'bold',
  },

});
