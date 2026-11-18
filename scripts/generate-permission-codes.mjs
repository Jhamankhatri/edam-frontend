import { readFile, writeFile } from 'node:fs/promises';

const catalogue = JSON.parse(
  await readFile(new URL('../src/config/permission-catalogue.json', import.meta.url), 'utf8'),
);
const codes = catalogue.codes.map((code) => `  '${code}',`).join('\n');
const output = `// Generated from src/config/permission-catalogue.json. Do not edit by hand.\n// Source: Jhamankhatri/edam@620f7a795cc67a16e905115131f561bbd986af85 permissions.json.\n\nexport const PERMISSION_CODES = [\n${codes}\n] as const;\n\nexport type PermissionCode = (typeof PERMISSION_CODES)[number];\n\nexport const PERMISSION_CODE_SET: ReadonlySet<string> = new Set(PERMISSION_CODES);\n`;
await writeFile(new URL('../src/auth/permission-codes.ts', import.meta.url), output, 'utf8');
console.log(`Generated ${catalogue.codes.length} permission codes.`);
