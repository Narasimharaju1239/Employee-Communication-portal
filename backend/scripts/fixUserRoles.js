// Script to fix user roles in MongoDB to use capitalized values only
import mongoose from 'mongoose';
import User from '../models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/employee';

async function fixRoles() {
  await mongoose.connect(MONGO_URI);
  const result = await User.updateMany(
    { role: { $in: ['employee', 'admin', 'superadmin', 'newuser'] } },
    [{
      $set: {
        role: {
          $switch: {
            branches: [
              { case: { $eq: ['$role', 'employee'] }, then: 'Employee' },
              { case: { $eq: ['$role', 'admin'] }, then: 'Admin' },
              { case: { $eq: ['$role', 'superadmin'] }, then: 'SuperAdmin' },
              { case: { $eq: ['$role', 'newuser'] }, then: 'NewUser' }
            ],
            default: '$role'
          }
        }
      }
    }]
  );
  console.log('Roles updated:', result.modifiedCount);
  await mongoose.disconnect();
}

fixRoles().catch(console.error);
