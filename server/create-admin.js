import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const adminEmail = 'admin@examflow.com';
    const adminPassword = 'admin123';

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin already exists. Updating to ensure admin role...');
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('Admin updated successfully.');
    } else {
      console.log('Creating new admin user...');
      const admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log('Admin created successfully.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
