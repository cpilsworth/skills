import assert from 'node:assert/strict';
import { lstat, readFile, readdir, realpath } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncPluginSkills } from './sync-plugin-skills.mjs';

await syncPluginSkills({ check: true });

const root = fileURLToPath(new URL('../', import.meta.url));
const json = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const variants = new Map([
  ['recollected', { url: 'https://recollected.link/mcp', auth: 'ON_USE', writes: false }],
  ['recollected-admin', { url: 'https://admin.recollected.link/mcp/admin', auth: 'ON_INSTALL', writes: true }]
]);

async function inside(directory, path) {
  assert.equal(typeof path, 'string');
  assert.ok(path.startsWith('./'), `Plugin path must start with ./: ${path}`);
  const resolved = await realpath(resolve(directory, path));
  const parent = await realpath(directory);
  assert.ok(resolved.startsWith(`${parent}${sep}`), `Plugin path must remain inside its package: ${path}`);
  return resolved;
}

async function checkFiles(directory) {
  for (const entry of await readdir(directory)) {
    const path = resolve(directory, entry);
    const stats = await lstat(path);
    assert.ok(!stats.isSymbolicLink(), `Plugin must be self-contained: ${relative(root, path)}`);
    if (stats.isDirectory()) await checkFiles(path);
    else {
      const text = await readFile(path, 'utf8');
      assert.ok(!/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|cfat_[A-Za-z0-9]{30,}/.test(text),
        `Possible credential in ${relative(root, path)}`);
    }
  }
}

const claude = await json('.claude-plugin/marketplace.json');
const codex = await json('.agents/plugins/marketplace.json');
assert.equal(claude.name, 'cpilsworth-skills');
assert.equal(codex.name, claude.name);
for (const catalog of [claude, codex]) {
  assert.deepEqual(catalog.plugins.map(plugin => plugin.name).sort(), [...variants.keys()].sort());
}

for (const [name, settings] of variants) {
  const directory = resolve(root, 'plugins', name);
  const claudeEntry = claude.plugins.find(plugin => plugin.name === name);
  const codexEntry = codex.plugins.find(plugin => plugin.name === name);
  assert.equal(claudeEntry.source, `./plugins/${name}`);
  assert.deepEqual(codexEntry.source, { source: 'local', path: `./plugins/${name}` });
  assert.deepEqual(codexEntry.policy, { installation: 'AVAILABLE', authentication: settings.auth });
  const manifests = [];
  for (const client of ['claude', 'codex']) {
    const manifest = await json(`plugins/${name}/.${client}-plugin/plugin.json`);
    assert.equal(manifest.name, name);
    assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
    assert.ok(manifest.description.length > 0);
    assert.equal(manifest.license, 'Apache-2.0');
    assert.equal(manifest.repository, 'https://github.com/cpilsworth/skills');
    await inside(directory, manifest.skills);
    assert.equal(await inside(directory, manifest.mcpServers), resolve(directory, '.mcp.json'));
    manifests.push(manifest);
  }
  assert.equal(manifests[0].version, manifests[1].version);
  const capabilities = manifests[1].interface.capabilities;
  assert.ok(capabilities.includes('Interactive'));
  assert.equal(capabilities.includes('Write'), settings.writes);
  assert.ok(manifests[1].interface.defaultPrompt.length <= 3);
  assert.ok(manifests[1].interface.defaultPrompt.every(prompt => prompt.length <= 128));
  const mcp = await json(`plugins/${name}/.mcp.json`);
  // Static credentials, headers, shell commands, and additional servers do not belong in these bundles.
  assert.deepEqual(mcp, { mcpServers: { [name]: { type: 'http', url: settings.url } } });
  assert.equal(new URL(settings.url).protocol, 'https:');
  await checkFiles(directory);
}
console.log('Validated both client marketplaces, four plugin manifests, and two self-contained MCP/skill bundles.');
