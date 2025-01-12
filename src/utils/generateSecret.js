const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const generateJwtSecret = (length = 64) => {
  return crypto.randomBytes(length).toString('hex');
};

const generateSecretKey = () => {
  const jwtSecret = generateJwtSecret();
  const envPath = path.join(process.cwd(), '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    
    if (envContent.includes('JWT_SECRET=')) {
      envContent = envContent.replace(
        /JWT_SECRET=.*/,
        `JWT_SECRET=${jwtSecret}`
      );
    } else {
      envContent += `\nJWT_SECRET=${jwtSecret}`;
    }
  } else {
    envContent = `JWT_SECRET=${jwtSecret}`;
  }
  
  fs.writeFileSync(envPath, envContent);
  
  return {
    message: 'JWT Secret generated successfully!',
    secret: jwtSecret
  };
};

module.exports = {
  generateJwtSecret,
  generateSecretKey
};
