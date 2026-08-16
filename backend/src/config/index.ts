import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'eduintelli_super_secret_jwt_key_hackathon_2025',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  postgresUrl: process.env.POSTGRES_URL || '',
  dbType: (process.env.DB_TYPE as 'postgres' | 'sqlite') || 'sqlite',
  sqliteDbPath: process.env.SQLITE_DB_PATH || path.resolve(__dirname, '../../../database/eduintelli.db'),
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  aiModel: process.env.AI_MODEL || 'gemini-1.5-flash',
  aiEngineMode: (process.env.AI_ENGINE_MODE as 'deterministic' | 'llm' | 'hybrid') || 'hybrid',

  // Configurable Academic Risk Weights
  riskWeights: {
    attendance: 0.25,
    assignments: 0.20,
    examinations: 0.35,
    trend: 0.20,
  },
  thresholds: {
    attendanceWarning: 75.0, // Institutional mandatory attendance percentage
    riskLowMax: 30,
    riskMediumMax: 60,
  }
};
