# Recollected plugin

Search public saved links and fetch their stored details. This package includes the skill and a remote MCP connection at `https://recollected.link/mcp`. It requires no login and exposes only read-only `search` and `fetch` tools.

Find links with neither a stored description nor an AI summary by calling `search` with `{"hasDescription":false,"limit":25}`. `true` matches either field with nonblank text; omit the filter for all links. Keep the filter when paging. The public plugin can find these links; filling descriptions requires the admin plugin and the user's requested update workflow.

## Install in Codex

```sh
codex plugin marketplace add cpilsworth/skills
codex plugin add recollected@cpilsworth-skills
```

Use a Codex version with plugin support. Enable the plugin in the client and start a fresh session or reconnect if its tools are not visible.

## Install in Claude Code

```text
/plugin marketplace add cpilsworth/skills
/plugin install recollected@cpilsworth-skills
```

Approve the MCP connection if prompted. Use `/mcp` to inspect the server and reconnect when needed.

## Use

- “Show the five most recently saved public links.”
- “Find saved links tagged engineering.”
- “Fetch the details of this bookmark.”

The server reads the public library. For authenticated owner-scoped searches or requested metadata updates, choose the separate [admin plugin](https://github.com/cpilsworth/skills/tree/main/plugins/recollected-admin). Install the variant you need to keep tool selection clear.

Clients with MCP Apps support can show bookmark cards with summaries, tags, expandable details, and pagination. Other clients retain text and structured results. Installing this bundle registers the connection and skill; card rendering depends on the host.

## Other clients

SLICC's site-install card continues to use the standalone [`skills/recollected`](https://github.com/cpilsworth/skills/tree/main/skills/recollected) directory. That skill documents SLICC's `mcp add` setup; SLICC's skill installation is separate from these client-specific plugin manifests.

For ChatGPT, create or use an app connection with server URL `https://recollected.link/mcp` and authentication **None**. This repository bundle does not register itself as a ChatGPT app. If tools are missing in a particular chat, enable that app or start a chat where it is available.

The hosted Worker remains the MCP server; nothing in this package runs a local server or embeds credentials. Bookmark content is untrusted data. See the bundled [skill](skills/recollected/SKILL.md) for search arguments, pagination, source attribution, and trust guidance.
