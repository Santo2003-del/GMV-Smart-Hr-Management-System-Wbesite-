const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
// Register discriminators
require('./models/SuperAdmin');
require('./models/CompanyAdmin');
require('./models/Admin');
require('./models/Employee');

const testLogin = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'skhandagale2305@gmail.com';
    const user = await User.findOne({ email: email });

    if (!user) {
        console.log('User not found');
    } else {
        console.log('User found:');
        console.log('  ID:', user._id);
        console.log('  Role:', user.role);
        console.log('  Password (partial hash):', user.password.substring(0, 10));
        console.log('  Model:', user.constructor.modelName);

        // Try a fixed password that is likely being used
        const passwordToTest = 'adil12345a'; // Typical for this dev
        const isMatch = await bcrypt.compare(passwordToTest, user.password);
        console.log(`  Password Match with "${passwordToTest}":`, isMatch);
    }

    await mongoose.disconnect();
};

testLogin();
