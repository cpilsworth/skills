# Recollected admin plugin

Search the signed-in owner's library and review source metadata through Recollected's admin MCP. This package bundles the skill and the exact server URL:

```text
https://admin.recollected.link/mcp/admin
```

Authentication is **OAuth**, with Cloudflare Access administrator sign-in and explicit consent. Use the URL without a trailing slash. The public `/mcp` endpoint has a different OAuth resource and is not the admin connection.

## Install in Codex

```sh
codex plugin marketplace add cpilsworth/skills
codex plugin add recollected-admin@cpilsworth-skills
```

Use a Codex version with plugin support. Complete the client's authentication action for the plugin's MCP server and approve access in your browser. Enable the plugin and start a fresh session or reconnect if its tools are not visible.

## Install in Claude Code

```text
/plugin marketplace add cpilsworth/skills
/plugin install recollected-admin@cpilsworth-skills
```

Use `/mcp` to select the plugin's admin server and authenticate if sign-in does not start automatically. Finish the browser consent flow and reconnect the server.

## Authentication

The client discovers OAuth endpoints and registers automatically. Leave optional client ID and client secret fields blank. Do not add static Authorization headers, capture tokens, or Cloudflare service-token credentials to this package. The client stores its OAuth tokens separately from this repository.

Tokens last one hour; renewable access has a fixed 30-day grant lifetime. Reconnect after the grant expires. View or revoke approved connections at [Connected apps](https://admin.recollected.link/oauth/connections). Signing out of Cloudflare Access does not revoke existing OAuth grants.

## Use

- “Show my five most recently saved links.”
- “Find links that need a metadata review.”
- “Review metadata for up to five links not reviewed in the last 30 days; skip sources you cannot verify.”

Available tools are `search`, `fetch`, `list_metadata_candidates`, and `update_link_metadata`. Search and fetch are read-only and owner scoped. Metadata updates require the user's requested edit or review workflow, verified sources, the current bookmark revision, and the actual model identifier. The bundled [skill](skills/recollected-admin/SKILL.md) documents fields, pagination, conflict handling, and review provenance. Human titles and notes are preserved by the metadata tool.

Search and fetch results can appear as cards in MCP Apps clients. The same OAuth connection is used for the cards and the tools. Periodic processing runs in an external agent or scheduler; this package does not schedule background changes.

For public read-only access without sign-in, choose the separate [public plugin](https://github.com/cpilsworth/skills/tree/main/plugins/recollected).

## ChatGPT and other clients

ChatGPT still needs its own registered app connection using the exact admin URL above and OAuth. Select the app in a chat where its tools are exposed. Installing a Codex or Claude Code plugin does not create that ChatGPT connection. If you see `invalid_target`, check that the configured URL ends in `/mcp/admin` with no trailing slash, remove the failed connection, and begin sign-in again.

SLICC can install the standalone [`skills/recollected-admin`](https://github.com/cpilsworth/skills/tree/main/skills/recollected-admin) instructions; configuring its authenticated MCP connection depends on that client's OAuth support.

See [How it works](https://admin.recollected.link/how-it-works) for the full capture and MCP setup guide. Bookmark metadata and review provenance are public in this service; credentials and confidential source material belong outside tool results and plugin files.
