import fs from 'node:fs';
import path from 'node:path';

const possiblePaths = [
  path.resolve(import.meta.dirname, '../apps/fe/node_modules/@opennextjs/cloudflare/dist/cli/build/bundle-server.js'),
  path.resolve(import.meta.dirname, '../node_modules/@opennextjs/cloudflare/dist/cli/build/bundle-server.js'),
];

for (const filePath of possiblePaths) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (!content.includes('sharp: path.join(buildOpts.outputDir, "cloudflare-templates/shims/empty.js")')) {
      content = content.replace(
        '"@next/env": path.join(buildOpts.outputDir, "cloudflare-templates/shims/env.js"),',
        '"@next/env": path.join(buildOpts.outputDir, "cloudflare-templates/shims/env.js"),\n            sharp: path.join(buildOpts.outputDir, "cloudflare-templates/shims/empty.js"),'
      );
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ Patched @opennextjs/cloudflare at ${filePath}`);
    }
  }
}
