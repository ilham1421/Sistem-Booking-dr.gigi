const { execSync } = require('child_process');
try {
  const out = execSync('npx tsc --noEmit', { encoding: 'utf-8', cwd: __dirname });
  require('fs').writeFileSync(__dirname + '/tsc_result.txt', 'SUCCESS\n' + out);
} catch (e) {
  const result = 'EXIT: ' + e.status + '\nSTDOUT:\n' + (e.stdout || '') + '\nSTDERR:\n' + (e.stderr || '');
  require('fs').writeFileSync(__dirname + '/tsc_result.txt', result);
}
