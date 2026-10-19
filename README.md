# Skills for AI Coding Agents

A collection of skills for AI coding agents.

## Installation

The **Recollected** plugins bundle both their skill and the hosted MCP connection. Choose one:

| Plugin | Access | Authentication |
|-------|--------|----------------|
| [`recollected`](plugins/recollected/README.md) | Public library; read-only search and details | None |
| [`recollected-admin`](plugins/recollected-admin/README.md) | Your library; search, details, and requested metadata reviews | Administrator OAuth |

Both packages include Codex and Claude Code manifests, their skill, MCP configuration, and license. The Worker stays hosted on Cloudflare. Installing a package does not start a local server or schedule metadata changes. Clients supporting MCP Apps can render bookmark cards; other clients receive text and structured results.

### Codex Plugins

Use a Codex version with plugin support:

```bash
codex plugin marketplace add cpilsworth/skills
codex plugin add recollected@cpilsworth-skills

# Choose this instead for authenticated searches and metadata reviews:
codex plugin add recollected-admin@cpilsworth-skills
```

For the admin variant, complete the client's sign-in action and approve OAuth access in the browser. Enable the plugin and reconnect or start a fresh session if its tools are not visible.

### Claude Code Plugins

```bash
# Add the skills marketplace
/plugin marketplace add cpilsworth/skills

# Install public, read-only Recollected
/plugin install recollected@cpilsworth-skills

# Choose this instead for authenticated searches and metadata reviews:
/plugin install recollected-admin@cpilsworth-skills
```

Use `/mcp` to inspect the added server and authenticate the admin connection if prompted. The marketplace currently publishes the two Recollected bundles. The other repository skills remain available through the standalone installation methods below.

### ChatGPT

ChatGPT uses its own registered app connection. Configure one of these exact server URLs:

| Use | Server URL | Authentication |
|-----|------------|----------------|
| Public read-only | `https://recollected.link/mcp` | None |
| Administrator | `https://admin.recollected.link/mcp/admin` | OAuth |

Use the admin URL without a trailing slash and leave optional client ID/secret fields blank for dynamic registration. Sign in, approve access, and select the app in a chat where its tools are available. Repository plugin installation and ChatGPT app registration are separate. An `invalid_target` error means the requested OAuth resource does not match the admin endpoint; check the URL and begin a fresh connection.

### Vercel Skills (npx skills)

```bash
# Install the CF HTML Preview skill
npx skills add cpilsworth/skills -s cf-html-visualise

# List available skills
npx skills add cpilsworth/skills --list
```

### upskill (GitHub CLI Extension)

```bash
gh extension install trieloff/gh-upskill

# Install the CF HTML Preview skill
gh upskill cpilsworth/skills --path cpilsworth/skills/cf-html-visualise

# List available skills
gh upskill cpilsworth/skills --list
```

## Available Skills

| Skill | Description |
|-------|-------------|
| `cf-html-visualise` | Generate production-ready Handlebars HTML templates for AEM Content Fragment preview rendering |
| [`recollected`](skills/recollected/SKILL.md) | Search saved links and fetch stored bookmark details through the public Recollected MCP server |
| [`recollected-admin`](skills/recollected-admin/SKILL.md) | Search the authenticated library and review verified source metadata with revision checks |

### recollected

Connects to `https://recollected.link/mcp` using Streamable HTTP. The public `search` and `fetch` tools need no login or credentials and cannot modify bookmarks. The skill includes pagination, source attribution, and guidance for treating saved content as untrusted data.

```bash
gh upskill cpilsworth/skills --path skills/recollected
```

Recollected also advertises this directory through a SLICC `upskill` HTTP response header, allowing visitors to choose whether to install it. See [`skills/recollected/SKILL.md`](skills/recollected/SKILL.md) for setup and usage.

### cf-html-visualise

Creates semantic HTML templates that render AEM Content Fragments in preview mode. The skill handles:

- **Schema Discovery** — Fetches model definitions from AEM environments via the OpenAPI Delivery API
- **Field Mapping** — Translates complex AEM schemas into structured field maps
- **Template Generation** — Produces Handlebars templates with correct triple/double brace usage, conditionals, and iteration
- **Nested Content** — Supports nested content fragments, multi-valued fields, and asset references with configurable hydration depth

**Quick Start:**
```bash
# Say: "create a preview template for the Article model on my AEM author instance"
```

The skill will guide you through identifying the target environment, fetching the model schema, and generating a complete template.

## Repository Structure

```
.agents/plugins/marketplace.json     # Codex marketplace
.claude-plugin/marketplace.json       # Claude Code marketplace
plugins/
├── recollected/                      # Public MCP + skill + both client manifests
└── recollected-admin/                # Admin OAuth MCP + skill + both client manifests
skills/
├── recollected/SKILL.md              # Canonical public skill; existing SLICC install path
└── recollected-admin/SKILL.md        # Canonical admin skill
cpilsworth/skills/
├── cf-html-visualise/                # Existing AEM preview skill and references
└── proto-publish/                   # Existing publishing skill
scripts/
├── sync-plugin-skills.mjs            # Copy canonical skills and license into packages
└── validate-plugins.mjs              # Check package paths, MCP endpoints, and catalogs
```

## Maintain and validate

```bash
npm ci
# Edit canonical skills in skills/, then update their committed plugin copies:
npm run plugins:sync
npm run validate
```

CI validates all skills and both client packages, and uses Claude Code's pinned plugin validator for the marketplace and each bundle. Validation fails if committed plugin skills or licenses drift from their canonical sources. Plugin packages are self-contained so installing a subdirectory does not depend on files elsewhere in the repository. Keep the `.mcp.json` files limited to endpoint settings; OAuth tokens are managed by each client.

## Resources

- [agentskills.io Specification](https://agentskills.io)
- [Claude Code Plugins](https://code.claude.com/docs/en/discover-plugins)
- [Vercel Skills](https://github.com/vercel-labs/skills)
- [upskill GitHub Extension](https://github.com/trieloff/gh-upskill)
- [AEM Content Fragment OpenAPI](https://developer.adobe.com/experience-cloud/experience-manager-apis/api/stable/sites/)

## License

Apache 2.0 - see [LICENSE](LICENSE) for details.
