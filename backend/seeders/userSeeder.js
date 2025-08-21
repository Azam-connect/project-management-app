const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { log } = require("../utils/debugger");

const createAdminUser = async () => {
    try {
        const user = new User({
            name: 'Admin',
            email: 'admin@pma.com',
            password: await bcrypt.hash('admin123', (Number(process.env.PASSWORD_SALT) || 10)), // Hashing the password
            role: 'admin',
        });
        await user.save();
        log('Admin user created successfully:', user);
        process.exit(0);
    } catch (error) {
        log('Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser();