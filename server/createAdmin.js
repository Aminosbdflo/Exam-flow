import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Import the real User model (which auto-hashes password on save)
import User from './models/User.js';

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('Connected to MongoDB...');

    const existing = await User.findOne({ email: 'admin@examflow.com' });
    if (existing) {
        // Update to admin role in case it exists as a normal user
        existing.role = 'admin';
        existing.tokens = 9999;
        await existing.save();
        console.log('');
        console.log('✅ Admin already existed — rôle mis à jour !');
        console.log('   Email    : admin@examflow.com');
        console.log('   Password : Admin@1234  (mot de passe original conservé)');
        process.exit(0);
    }

    // Create new admin — password is auto-hashed by the pre('save') hook
    const admin = new User({
        name: 'Admin',
        email: 'admin@examflow.com',
        password: 'Admin@1234',
        role: 'admin',
        tokens: 9999,
    });
    await admin.save();

    console.log('');
    console.log('✅ Compte admin créé avec succès !');
    console.log('──────────────────────────────────');
    console.log('   Email    : admin@examflow.com');
    console.log('   Password : Admin@1234');
    console.log('──────────────────────────────────');
    process.exit(0);
}).catch(err => {
    console.error('❌ Erreur MongoDB:', err.message);
    process.exit(1);
});
