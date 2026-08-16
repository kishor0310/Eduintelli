import fs from 'fs';
import path from 'path';
import { db } from './db';

export async function initializeDatabase(forceSeed: boolean = false) {
  try {
    console.log('🔄 Checking database initialization...');
    
    // Check if users table exists and has data
    let userCount = 0;
    try {
      const result = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM users');
      userCount = result ? Number(result.count) : 0;
    } catch {
      userCount = 0;
    }

    if (userCount === 0 || forceSeed) {
      console.log('🌱 Initializing schema and seeding realistic dataset...');
      
      const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
      const seedPath = path.resolve(__dirname, '../../../database/seed.sql');

      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
        await db.exec(schemaSql);
        console.log('✅ Database schema created successfully.');
      } else {
        console.warn('⚠️ schema.sql not found at:', schemaPath);
      }

      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf-8');
        await db.exec(seedSql);
        console.log('✅ Database seeded with 21 students, 5 teachers, 8 courses, and academic records.');
      } else {
        console.warn('⚠️ seed.sql not found at:', seedPath);
      }
    } else {
      console.log(`✨ Database already contains ${userCount} users. Ready for demo!`);
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// If executed directly via CLI
if (require.main === module) {
  initializeDatabase(true)
    .then(() => {
      console.log('🎉 Database seeding completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Failed to seed database:', err);
      process.exit(1);
    });
}
