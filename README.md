# AEM Content Fragment Skills for AI Coding Agents

Skills for AI coding agents that generate Handlebars-based HTML preview templates for AEM Content Fragments.

## Installation

### Claude Code Plugins

```bash
# Add the skills marketplace
/plugin marketplace add cpilsworth/skills

# Install the CF HTML Preview skill
/plugin install cf-html-visualise@cpilsworth-skills
```

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
cpilsworth/
└── skills/
    └── cf-html-visualise/
        ├── .claude-plugin/
        │   └── plugin.json                   # Claude Code plugin marketplace config
        ├── SKILL.md                          # Skill definition
        ├── references/
        │   ├── cf-html-preview-guide.md      # Handlebars template authoring guide
        │   └── openapi-workflow.md           # API workflow documentation
        └── scripts/
            └── fetch-model-schema.sh         # Automated schema fetching script
```

## Resources

- [agentskills.io Specification](https://agentskills.io)
- [Claude Code Plugins](https://code.claude.com/docs/en/discover-plugins)
- [Vercel Skills](https://github.com/vercel-labs/skills)
- [upskill GitHub Extension](https://github.com/trieloff/gh-upskill)
- [AEM Content Fragment OpenAPI](https://developer.adobe.com/experience-cloud/experience-manager-apis/api/stable/sites/)

## License

Apache 2.0 - see [LICENSE](LICENSE) for details.
