// Thin wrapper: the canonical generator lives in packages/shared/scripts.
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const script = path.join(__dirname, '../../../packages/shared/scripts/generate-theme-css.mjs');
const result = spawnSync('bun', [script, ...process.argv.slice(2)], { stdio: 'inherit' });
process.exit(result.status ?? 1);
