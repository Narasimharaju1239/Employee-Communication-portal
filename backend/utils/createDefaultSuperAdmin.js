// server/utils/createDefaultSuperAdmin.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const createDefaultSuperAdmin = async () => {
  try {
    const existing = await User.findOne({ email: 'narasimharaju1239@gmail.com' });
    if (!existing) {
      const hashedPassword = await bcrypt.hash('N123456789', 10);
      await User.create({
        name: 'Super Admin',
        email: 'narasimharaju1239@gmail.com',
        password: hashedPassword,
        role: 'SuperAdmin'
      });
      console.log('✅ Default SuperAdmin created');
    } else {
      console.log('✅ Default SuperAdmin already exists');
    }
  } catch (err) {
    console.error('❌ Error creating default SuperAdmin', err.message);
  }
};

export default createDefaultSuperAdmin;
