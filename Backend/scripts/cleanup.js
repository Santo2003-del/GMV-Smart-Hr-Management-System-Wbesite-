const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

const cleanup = async () => {
    await connectDB();

    const collections = [
        'users',
        'companies',
        'inquiries',
        'attendances',
        'leaves',
        'tasks',
        'interviews',
        'recruitmentjobs',
        'applications'
    ];

    console.log('🧹 Starting Database Cleanup...');

    for (const colName of collections) {
        try {
            const result = await mongoose.connection.collection(colName).deleteMany({});
            console.log(`  - Deleted ${result.deletedCount} documents from "${colName}"`);
        } catch (err) {
            console.warn(`  - Skip: Collection "${colName}" not found or error occurred.`);
        }
    }

    console.log('✅ Cleanup Complete!');
    await mongoose.disconnect();
    process.exit(0);
};

cleanup();
