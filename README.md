# 🌳 Themetree

**Automatically color your VSCode/Cursor IDE based on the current git branch.**

Perfect for developers who use git worktrees - each branch gets a distinct, visually appealing dark-mode theme so you always know which branch you're working on.

![Themetree Demo](./docs/demo.gif)

## ✨ Features

- **Deterministic colors** - The same branch name always produces the same color, across all machines
- **12 curated themes** - Beautiful dark-mode color palettes (Ocean, Forest, Sunset, Violet, Rose, Teal, Amber, Crimson, Indigo, Emerald, Fuchsia, Cyan)
- **Neutral branches** - `main`, `master`, `develop` use subtle neutral colors
- **Three intensity levels** - Subtle, Medium, or Vibrant theming
- **Auto-detection** - Instantly switches colors when you change branches
- **Works everywhere** - VSCode, Cursor, and other VSCode-based IDEs

## 📦 Installation

### From VSIX (local)

```bash
cd themetree
npm install
npm run compile
# Then press F5 to run Extension Development Host
```

### From Marketplace
*Coming soon*

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

## 📝 License

MIT
