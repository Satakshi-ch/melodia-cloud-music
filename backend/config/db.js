import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      throw new Error("No MongoDB URI configured in environment variables.");
    }
    
    // Set connection timeout to 3 seconds for local testing checks
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useMockDB = false;
  } catch (error) {
    console.warn(`[DATABASE WARNING] Could not connect to MongoDB Atlas/Local: ${error.message}`);
    console.warn(`[FALLBACK ACTIVATED] Melodia will run in Local Mock Database Mode using data/*.json files.`);
    global.useMockDB = true;
  }
};

export default connectDB;
