const { existsSync } = require('fs');
const { execSync } = require('child_process');

if (!existsSync('node_modules')) {
  const command = existsSync('package-lock.json') ? 'npm ci' : 'npm install';
  console.log(`node_modules not found. Running "${command}" before tests...`);
  execSync(command, { stdio: 'inherit' });
}
