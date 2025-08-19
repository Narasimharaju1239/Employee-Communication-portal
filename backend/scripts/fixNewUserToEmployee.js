// Script to update all users with role 'NewUser' or 'newuser' to 'Employee'
import mongoose from 'mongoose';
import User from '../models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/employee';

async function fixNewUserRoles() {
  await mongoose.connect(MONGO_URI);
  const result = await User.updateMany(
    { role: { $in: ['NewUser', 'newuser'] } },
    { $set: { role: 'Employee' } }
  );
  console.log('Users updated:', result.modifiedCount);
  await mongoose.disconnect();
}

fixNewUserRoles().catch(console.error);
