# 🌳 Themetree

[![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/hjegeorge.themetree?label=VS%20Code%20Marketplace&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=hjegeorge.themetree)
[![Open VSX](https://img.shields.io/open-vsx/v/hjegeorge/themetree?label=Open%20VSX&logo=eclipse)](https://open-vsx.org/extension/hjegeorge/themetree)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Automatically color your VSCode/Cursor IDE based on the current git branch.**

Perfect for developers who use git worktrees - each branch gets a distinct, visually appealing dark-mode theme so you always know which branch you're working on.

![Themetree Demo](./docs/demo.gif)

## ✨ Features

- **Deterministic colors** - The same branch name always produces the same color, across all machines
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

## 🤔 How It Works

1. Themetree watches for git branch changes using VSCode's built-in git extension
2. When a branch change is detected, it hashes the branch name using the djb2 algorithm
3. The hash is mapped to one of 12 curated color themes using golden ratio distribution
4. Color customizations are applied to `workbench.colorCustomizations` in workspace settings
5. Default branches (`main`, `master`, etc.) clear all customizations for your normal theme

The hash function is deterministic, so `feature/user-auth` will always be the same color, whether you're on your laptop, desktop, or colleague's machine.

## ❓ FAQ

### Will this override my existing workspace color customizations?

**Yes.** Themetree writes to `workbench.colorCustomizations` in your workspace settings. If you have existing customizations, they will be replaced when Themetree applies a theme, and **cleared entirely** when you switch to a default branch (main, master, etc.).

**Workaround:** If you have workspace-specific colors you want to keep, consider:
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
