import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/spendwise';
    const conn = await mongoose.connect(connUri);
    console.log(`[SpendWise DB] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[SpendWise DB Error]: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      console.error('Please verify your MONGODB_URI in the server .env file.');
    }
    throw error;
  }
};

export default connectDB;
