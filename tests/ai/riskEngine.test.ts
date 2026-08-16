import { RiskEngine, StudentAcademicRawData } from '../../backend/src/services/ai/riskEngine';

console.log('🧪 Running AI Risk Engine Unit Tests...');

// Test 1: High Risk Student Profile (Low Attendance + Exam Deficit)
const highRiskStudent: StudentAcademicRawData = {
  studentId: 'std-02',
  attendancePercentage: 62,
  totalClasses: 10,
  missedClasses: 4,
  lateClasses: 1,
  assignmentAverage: 53.3,
  totalAssignments: 4,
  submittedAssignments: 3,
  lateSubmissions: 2,
  missingAssignments: 1,
  examAverage: 50.0,
  midtermScore: 48.0,
  previousAssessmentAverage: 68.0, // Significant 18% decline
  courseScores: [
    { courseCode: 'CS401', courseName: 'Discrete Mathematics', score: 51, attendance: 62 },
    { courseCode: 'CS402', courseName: 'Operating Systems', score: 55, attendance: 65 }
  ]
};

const resultHigh = RiskEngine.computeRisk(highRiskStudent);
console.log('Result High Risk Score:', resultHigh.riskScore, 'Level:', resultHigh.riskLevel);
console.log('Reasons:', resultHigh.reasons);

if (resultHigh.riskLevel !== 'HIGH' || resultHigh.riskScore < 61) {
  throw new Error(`Test Failed: Expected HIGH risk level (>60), got ${resultHigh.riskLevel} (${resultHigh.riskScore})`);
}

// Test 2: Low Risk High-Performer Profile
const lowRiskStudent: StudentAcademicRawData = {
  studentId: 'std-01',
  attendancePercentage: 94,
  totalClasses: 15,
  missedClasses: 1,
  lateClasses: 0,
  assignmentAverage: 95.0,
  totalAssignments: 4,
  submittedAssignments: 4,
  lateSubmissions: 0,
  missingAssignments: 0,
  examAverage: 93.6,
  midtermScore: 94.0,
  previousAssessmentAverage: 95.0,
  courseScores: [
    { courseCode: 'CS401', courseName: 'Discrete Mathematics', score: 95, attendance: 94 },
    { courseCode: 'CS402', courseName: 'Operating Systems', score: 91, attendance: 96 }
  ]
};

const resultLow = RiskEngine.computeRisk(lowRiskStudent);
console.log('Result Low Risk Score:', resultLow.riskScore, 'Level:', resultLow.riskLevel);

if (resultLow.riskLevel !== 'LOW' || resultLow.riskScore > 30) {
  throw new Error(`Test Failed: Expected LOW risk level (<=30), got ${resultLow.riskLevel} (${resultLow.riskScore})`);
}

console.log('✅ All AI Risk Engine tests PASSED successfully!');
