const fs = require('fs');

const envContent = `DATABASE_URL="postgresql://neondb_owner:npg_6TLHBu1xXjCc@ep-falling-art-a1wnwqzo-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="sweetshop-super-secret-jwt-key-2024"`;

fs.writeFileSync('.env', envContent, 'utf8');
console.log('.env file created successfully');
console.log(envContent);
