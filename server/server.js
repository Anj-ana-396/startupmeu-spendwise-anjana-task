import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`========================================`);
      console.log(`🚀 SpendWise Server listening on port ${PORT}`);
      console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`========================================`);
    });
  } catch (error) {
    console.error('Failed to start SpendWise server:', error);
    process.exit(1);
  }
};

startServer();
