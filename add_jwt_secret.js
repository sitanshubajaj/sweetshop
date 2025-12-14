const fs = require('fs');
const content = fs.readFileSync('.env', 'utf8');
if (!content.includes('JWT_SECRET')) {
    fs.appendFileSync('.env', '\nJWT_SECRET="sweetshop-super-secret-jwt-key-2024"');
    console.log('Added JWT_SECRET');
} else {
    console.log('JWT_SECRET already exists');
}
