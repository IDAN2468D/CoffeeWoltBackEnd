const { generateSecretKey } = require('../utils/generateSecret');

console.log('Generating new JWT secret...');
const result = generateSecretKey();
console.log(result.message);
console.log('New JWT_SECRET has been added to your .env file');