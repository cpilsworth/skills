import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = new URL('../', import.meta.url);
export async function syncPluginSkills({ check = false } = {}) {
  for (const name of ['recollected', 'recollected-admin']) {
    for (const [source, target] of [
      [`skills/${name}/SKILL.md`, `plugins/${name}/skills/${name}/SKILL.md`],
      ['LICENSE', `plugins/${name}/LICENSE`]
    ]) {
      const contents = await readFile(new URL(source, root));
      const destination = new URL(target, root);
      if (check) {
        const actual = await readFile(destination).catch(() => null);
        if (!actual?.equals(contents)) throw new Error(`${target} is missing or outdated. Run npm run plugins:sync.`);
      } else {
        await mkdir(fileURLToPath(new URL('./', destination)), { recursive: true });
        await writeFile(destination, contents);
      }
    }
  }
  console.log(check ? 'Plugin skills and licenses match their canonical sources.' : 'Synced Recollected plugin skills and licenses.');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await syncPluginSkills({ check: process.argv.includes('--check') });
}
