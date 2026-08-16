import { app } from './app';
import { config } from './config';
import { initializeDatabase } from './database/seedRunner';

async function startServer() {
  try {
    // 1. Initialize schema & seed data if needed
    await initializeDatabase();

    // 2. Start HTTP server
    const port = config.port;
    app.listen(port, () => {
      console.log(`
🚀 =======================================================
🎓 EduIntelli — AI-Powered Academic Intelligence Platform
📡 Server running on http://localhost:${port}
🌐 Client URL: ${config.clientUrl}
🧠 AI Engine Mode: ${config.aiEngineMode}
=======================================================
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
