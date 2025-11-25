import * as vscode from 'vscode';

/**
 * Status bar item that shows the current Themetree theme.
 */
export class ThemetreeStatusBar {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this.statusBarItem.command = 'themetree.refresh';
    this.statusBarItem.tooltip = 'Click to refresh Themetree theme';
  }

  /**
   * Update the status bar with the current theme name.
   */
  update(themeName: string | undefined, branchName: string | undefined): void {
    if (!themeName || themeName === 'default') {
      // No theme applied (default branch or no branch)
      this.statusBarItem.text = '$(git-branch) Themetree';
      this.statusBarItem.backgroundColor = undefined;
    } else {
      this.statusBarItem.text = `$(paintcan) ${themeName}`;
      this.statusBarItem.backgroundColor = undefined;
    }
    
    this.statusBarItem.show();
  }

  /**
   * Hide the status bar item.
   */
  hide(): void {
    this.statusBarItem.hide();
  }

  /**
   * Dispose of the status bar item.
   */
  dispose(): void {
    this.statusBarItem.dispose();
  }
}


