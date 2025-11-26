# Changelog

All notable changes to Themetree will be documented in this file.

## [0.1.10] - 2025-11-26

### Added
- **External workspace file mode** - Colors are now stored in `~/.themetree/workspaces/` as `.code-workspace` files instead of modifying your repo's `.vscode/settings.json`
- **Per-window colors** - Multiple worktree windows can now display their own distinct colors simultaneously
- New setting `themetree.useWorkspaceFile` to toggle between workspace file mode (default) and legacy settings mode
- New command "Themetree: Reopen as Themetree Workspace" for manual workspace setup
- Friendly workspace naming with curated adjective-noun combinations (e.g., `projectname-swift-falcon.code-workspace`)

### Changed
- Default behavior no longer modifies repo files - your `.vscode/settings.json` stays untouched

## [0.1.8] - 2025-11-25

### Added
- Added icon
- Dw 0.1.1 to 0.1.7 were just me fixing the CI/CD, you didn't miss anything 

## [0.1.1] - 2025-11-25

### Changed
- Updated README with marketplace links and badges
- Added comprehensive FAQ section
- Added hiring section for Super44

## [0.1.0] - 2025-11-25

### Added
- Initial release
- Automatic theme coloring based on git branch name
- 12 curated dark-mode color themes (Ocean, Forest, Sunset, Violet, Rose, Teal, Amber, Crimson, Indigo, Emerald, Fuchsia, Cyan)
- Deterministic hashing - same branch always gets same color
- Default branches (main, master, develop, dev) keep default theme
- Wildcard pattern support for excluded branches
- Three intensity levels: subtle, medium, vibrant
- Commands: Refresh Theme, Clear Theme Colors
- Polling fallback for git detection reliability


