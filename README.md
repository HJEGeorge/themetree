# 🌳 Themetree

[![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/hjegeorge.themetree?label=VS%20Code%20Marketplace&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=hjegeorge.themetree)
[![Open VSX](https://img.shields.io/open-vsx/v/hjegeorge/themetree?label=Open%20VSX&logo=eclipse)](https://open-vsx.org/extension/hjegeorge/themetree)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


**Automatically color your VSCode/Cursor IDE based on the current git branch.**

Perfect for developers who use git worktrees - each branch gets a distinct, visually appealing dark-mode theme so you always know which branch you're working on.

![Themetree Demo](https://super44-images-hosted.s3.eu-central-1.amazonaws.com/themetree.gif)

<a href="https://www.producthunt.com/products/themetree?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-themetree" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.png?post_id=1042511&theme=light&t=1764173156456" alt="Themetree - An&#0032;IDE&#0032;extension&#0032;so&#0032;you&#0032;don&#0039;t&#0032;confuse&#0032;worktrees&#0032;vibecoding | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## ✨ Features

- **Deterministic colors** - The same branch name always produces the same color, across all machines
- **Per-window colors** - Multiple worktree windows show their own distinct colors simultaneously
- **Non-invasive** - Uses external workspace files, keeping your repo's `.vscode/settings.json` untouched
- **12 curated themes** - Beautiful dark-mode color palettes (Ocean, Forest, Sunset, Violet, Rose, Teal, Amber, Crimson, Indigo, Emerald, Fuchsia, Cyan)
- **Default branches** - `main`, `master`, `develop` keep your normal theme (no color overrides)
- **Three intensity levels** - Subtle, Medium, or Vibrant theming
- **Auto-detection** - Instantly switches colors when you change branches
- **Works everywhere** - VSCode, Cursor, and other VSCode-based IDEs

## 📦 Installation

### VS Code Marketplace

1. Open VS Code / Cursor
2. Go to Extensions (`Cmd+Shift+X` / `Ctrl+Shift+X`)
3. Search for "Themetree"
4. Click Install

Or install directly: [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=hjegeorge.themetree)

### Open VSX (for VSCodium, etc.)

[Open VSX Registry](https://open-vsx.org/extension/hjegeorge/themetree)

### From Source

```bash
git clone https://github.com/hjegeorge/themetree
cd themetree
npm install
npm run compile
# Press F5 to run Extension Development Host
```

## ⚙️ Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `themetree.enabled` | `true` | Enable/disable the extension |
| `themetree.intensity` | `"medium"` | Color intensity: `subtle`, `medium`, or `vibrant` |
| `themetree.defaultBranches` | `["main", "master", "develop", "dev"]` | Branches that keep default theme (no colors) |
| `themetree.excludedBranches` | `[]` | Branch patterns to exclude (supports wildcards like `release/*`) |
| `themetree.useWorkspaceFile` | `true` | Use external workspace file for per-window colors. When `false`, stores colors in `.vscode/settings.json` |

## 🎨 Color Palette

The extension includes 12 carefully curated dark-mode themes:

| Theme | Primary Color |
|-------|---------------|
| 🌊 Ocean | Azure Blue |
| 🌲 Forest | Forest Green |
| 🌅 Sunset | Burnt Orange |
| 💜 Violet | Vivid Purple |
| 🌸 Rose | Deep Pink |
| 🐬 Teal | Teal |
| 🍯 Amber | Amber |
| ❤️ Crimson | Red |
| 💙 Indigo | Indigo |
| 💚 Emerald | Emerald |
| 🌺 Fuchsia | Fuchsia |
| 🩵 Cyan | Cyan |

## 🔧 Commands

- **Themetree: Refresh Theme** - Manually refresh the current theme
- **Themetree: Clear Theme Colors** - Remove all Themetree color customizations
- **Themetree: Reopen as Themetree Workspace** - Manually reopen the current folder as a Themetree workspace

## 🤔 How It Works

1. Themetree watches for git branch changes using VSCode's built-in git extension
2. When a branch change is detected, it hashes the branch name using the djb2 algorithm
3. The hash is mapped to one of 12 curated color themes using golden ratio distribution
4. By default, Themetree creates an external `.code-workspace` file in `~/.themetree/workspaces/` with friendly names like `projectname-swift-falcon.code-workspace`. This keeps your repo files unmodified and enables per-window colors
5. Default branches (`main`, `master`, etc.) clear all customizations for your normal theme

The hash function is deterministic, so `feature/user-auth` will always be the same color, whether you're on your laptop, desktop, or colleague's machine.

**Note:** On first use, Themetree will prompt you to reopen your folder as a Themetree workspace. This is a one-time setup that enables per-window colors. You can disable this behavior by setting `themetree.useWorkspaceFile` to `false`.

## ❓ FAQ

### Will this override my existing workspace color customizations?

**By default, no.** Themetree now uses external workspace files stored in `~/.themetree/workspaces/`, so your repo's `.vscode/settings.json` remains untouched.

**If you set `useWorkspaceFile: false`:** Themetree will write to `workbench.colorCustomizations` in your workspace settings. In this mode, existing customizations will be replaced when Themetree applies a theme, and **cleared entirely** when you switch to a default branch (main, master, etc.).

**Workaround for legacy mode:** If you have workspace-specific colors you want to keep:
- Adding those branches to `themetree.excludedBranches`
- Using User-level settings instead of Workspace settings for your custom colors (User settings won't be affected)

### Why don't I see colors on `main` or `master`?

This is intentional! Default branches (`main`, `master`, `develop`, `dev`) are designed to show your normal IDE theme with no overrides. This gives you a visual "home base" and makes feature branches more distinctive.

You can customize which branches are treated as defaults via `themetree.defaultBranches`.

### Two of my branches have very similar colors - can I change one?

The colors are deterministically generated from branch names, so you can't manually assign colors (yet). However, branch names that are very different should produce different colors due to the hash algorithm.

**Future feature:** We plan to add manual color overrides for specific branches.

### Does this work with git worktrees?

**Yes!** This is exactly what Themetree was designed for. Each worktree has its own branch, and each VS Code window will show the appropriate color for that worktree's branch.

### Will my teammates see the same colors?

**Yes!** The hash function is deterministic, so `feature/add-login` will always produce the same color on every machine. Your whole team will see consistent colors for the same branches.

### Can I use this with light themes?

The current color palette is optimized for dark themes. Light theme support may come in a future update.

### The theme doesn't change when I switch branches

Try running the command **"Themetree: Refresh Theme"** from the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`). If that works, there may be a delay in git state detection. The extension includes a polling fallback that checks every 2 seconds.

## 👥 Contributors

- [@HJEGeorge](https://github.com/HJEGeorge) - Creator
- [@luksch42](https://github.com/luksch42) - Bug fixes

## 📝 License

MIT - do with this as you want, although would appreciate a shout out if you can

---

## 💼 We're Hiring!

Love vibe coding and building with AI? We built this extension in a single session with Claude.

We're hiring at **[Super44](https://www.super44.ai/)** - building the AI copilot for owner-run local businesses. If you're excited about AI-first development and want to help local business owners increase profits, reduce complexity, and save time, we'd love to hear from you!

👉 **[super44.ai](https://www.super44.ai/)**

---

**Note:** This extension was built with Claude (Opus 4.5). If you find issues, please [open an issue](https://github.com/hjegeorge/themetree/issues) or submit a PR!
