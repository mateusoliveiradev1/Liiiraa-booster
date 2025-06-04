const { existsSync } = require('fs');
const { execSync } = require('child_process');

if (!existsSync('node_modules')) {
  console.log('node_modules not found. Running "npm install" before tests...');
  execSync('npm install', { stdio: 'inherit' });
}
