const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outFile = path.join(__dirname, 'build_output.txt');

try {
  const result = execSync('npm run build', {
    encoding: 'utf-8',
    cwd: __dirname,
    timeout: 300000,
    stdio: 'pipe'
  });
  fs.writeFileSync(outFile, 'SUCCESS\n' + result);
} catch (e) {
  const output = [
    'EXIT CODE: ' + e.status,
    'STDOUT:',
    e.stdout || '(empty)',
    'STDERR:',
    e.stderr || '(empty)'
  ].join('\n');
  fs.writeFileSync(outFile, output);
}

console.log('Build result written to build_output.txt');
