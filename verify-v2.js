const { spawnSync } = require('child_process');

const checks = [
  'interactive/verify-v2.cjs',
  'interactive/verify-replay.cjs',
  'interactive/verify-practical.cjs',
  'interactive/verify-ledger.cjs',
  'interactive/verify-agent-gate.cjs',
  'interactive/verify-workbench-lock.cjs',
];

for (const check of checks) {
  console.log(`RUN ${check}`);
  const result = spawnSync(process.execPath, [check], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
