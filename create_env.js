const fs = require('fs');
fs.writeFileSync('.env', 'DATABASE_URL="postgresql://user:password@localhost:5432/sweetshop?schema=public"');
console.log('.env file created');
