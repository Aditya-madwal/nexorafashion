const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const generateSecretKey = () => {
    return crypto.randomBytes(64).toString('hex');
};

if (!process.env.JWT_SECRET) {
    const secretKey = generateSecretKey();
    const envPath = path.join(__dirname, '../.env');

    try {
        if (fs.existsSync(envPath)) {
            fs.appendFileSync(envPath, `\nJWT_SECRET=${secretKey}`);
        } else {
            fs.writeFileSync(envPath, `JWT_SECRET=${secretKey}`);
        }

        process.env.JWT_SECRET = secretKey;
        console.log('Generated and saved new JWT_SECRET');
    } catch (error) {
        console.error('Error writing JWT_SECRET to .env file:', error);
        process.exit(1);
    }
}

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set in environment variables');
    process.exit(1);
}

module.exports = process.env.JWT_SECRET;
