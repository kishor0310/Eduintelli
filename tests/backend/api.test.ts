import { AIService } from '../../backend/src/services/ai/aiService';
import { db } from '../../backend/src/database/db';
import { initializeDatabase } from '../../backend/src/database/seedRunner';

async function runBackendApiTests() {
  console.log('🧪 Running Backend Academic Intelligence & Database Tests...');

  // 1. Ensure DB initialized
  await initializeDatabase();

  // 2. Test Student A (Alex Rivera - std-01) AI analysis
  const alexAnalysis = await AIService.analyzeStudent('std-01');
  console.log('Alex Rivera (std-01) Risk Score:', alexAnalysis.risk.riskScore, 'Level:', alexAnalysis.risk.riskLevel);
  if (alexAnalysis.risk.riskLevel !== 'LOW') {
    throw new Error(`Expected Alex Rivera to be LOW risk, got ${alexAnalysis.risk.riskLevel}`);
  }

  // 3. Test Student B (Jordan Hayes - std-02) AI analysis
  const jordanAnalysis = await AIService.analyzeStudent('std-02');
  console.log('Jordan Hayes (std-02) Risk Score:', jordanAnalysis.risk.riskScore, 'Level:', jordanAnalysis.risk.riskLevel);
  if (jordanAnalysis.risk.riskLevel !== 'HIGH') {
    throw new Error(`Expected Jordan Hayes to be HIGH risk, got ${jordanAnalysis.risk.riskLevel}`);
  }

  // 4. Verify Causal Reasons Generation
  if (jordanAnalysis.risk.reasons.length === 0) {
    throw new Error('Expected Jordan Hayes to have explainable causal risk reasons');
  }
  console.log('Jordan Causal Reasons:', jordanAnalysis.risk.reasons);

  // 5. Verify Recommendations
  if (jordanAnalysis.recommendations.length === 0) {
    throw new Error('Expected Jordan Hayes to receive personalized 7-day recommendations');
  }
  console.log('Jordan 7-Day Recommendations Count:', jordanAnalysis.recommendations.length);

  // 6. Test User Login Query
  const studentUser = await db.get('SELECT * FROM users WHERE email = $1', ['student@demo.com']);
  if (!studentUser) {
    throw new Error('Expected demo student account to exist');
  }
  console.log('Demo Student Found:', studentUser.name);

  const teacherUser = await db.get('SELECT * FROM users WHERE email = $1', ['teacher@demo.com']);
  if (!teacherUser) {
    throw new Error('Expected demo teacher account to exist');
  }
  console.log('Demo Teacher Found:', teacherUser.name);

  const adminUser = await db.get('SELECT * FROM users WHERE email = $1', ['admin@demo.com']);
  if (!adminUser) {
    throw new Error('Expected demo admin account to exist');
  }
  console.log('Demo Admin Found:', adminUser.name);

  console.log('✅ All Backend & AI Integration Tests PASSED!');
}

runBackendApiTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Backend test failed:', err);
    process.exit(1);
  });
