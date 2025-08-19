// Script to set all users' status to 'active' except those with status 'pending'
// Usage: node fixUserStatus.js

import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name';

async function main() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const result = await User.updateMany(
    { status: { $ne: 'pending' } },
    { $set: { status: 'active' } }
  );
  console.log(`Updated ${result.nModified || result.modifiedCount} users to status 'active'.`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error updating user statuses:', err);
  process.exit(1);
});
