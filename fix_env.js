const fs = require('fs');

// Read existing values
const content = fs.readFileSync('.env', 'utf8');
console.log('Current .env content:');
console.log(content);

// Extract the DATABASE_URL and JWT_SECRET
const dbMatch = content.match(/DATABASE_URL="([^"]+)"/);
const jwtMatch = content.match(/JWT_SECRET="([^"]+)"/);

if (dbMatch && jwtMatch) {
    const newContent = `DATABASE_URL="${dbMatch[1]}"
JWT_SECRET="${jwtMatch[1]}"`;

    fs.writeFileSync('.env.new', newContent, 'utf8');
    console.log('\nNew .env.new created with:');
    console.log(newContent);
} else {
    console.log('Could not parse existing .env');
}
