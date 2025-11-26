import * as vscode from 'vscode';
import { BranchWatcher } from './git/branchWatcher';
import { ThemeApplier } from './theme/themeApplier';
import { WorkspaceManager } from './workspace/workspaceManager';

let branchWatcher: BranchWatcher | undefined;
let themeApplier: ThemeApplier | undefined;
let workspaceManager: WorkspaceManager | undefined;

/**
 * Extension activation.
 * Called when the extension is activated (on startup).
 */
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  console.log('Themetree: Activating...');

  // Initialize workspace manager and theme applier
  workspaceManager = new WorkspaceManager(context);
  themeApplier = new ThemeApplier(context, workspaceManager);
  
  // Initialize branch watcher with callback to apply theme
  branchWatcher = new BranchWatcher(async (branchName) => {
    console.log(`Themetree: Branch changed to "${branchName}"`);
    await handleThemeApplication(branchName);
  });

  // Register commands
  const refreshCommand = vscode.commands.registerCommand('themetree.refresh', async () => {
    branchWatcher?.refresh();
  });

  const clearCommand = vscode.commands.registerCommand('themetree.clear', async () => {
    await themeApplier?.clearColors();
  });

  // Command to manually reopen as Themetree workspace
  const reopenCommand = vscode.commands.registerCommand('themetree.reopenAsWorkspace', async () => {
    const folderPath = workspaceManager?.getOriginalFolderPath();
    if (folderPath && workspaceManager) {
      await workspaceManager.promptReopenAsWorkspace(folderPath);
    }
  });

  context.subscriptions.push(refreshCommand, clearCommand, reopenCommand);

  // Listen for workspace folder changes (when user opens a folder)
  const workspaceFoldersChanged = vscode.workspace.onDidChangeWorkspaceFolders(async () => {
    console.log('Themetree: Workspace folders changed, reinitializing...');
    await branchWatcher?.initialize();
    const currentBranch = branchWatcher?.getCurrentBranch();
    await handleThemeApplication(currentBranch);
  });

  context.subscriptions.push(workspaceFoldersChanged);

  // Start watching for branch changes
  await branchWatcher.initialize();

  // Apply theme for current branch immediately (if workspace is open)
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
    const currentBranch = branchWatcher.getCurrentBranch();
    await handleThemeApplication(currentBranch);
  }

  console.log('Themetree: Activated successfully');
}

/**
 * Handle theme application with reopen prompt if needed.
 */
async function handleThemeApplication(branchName: string | undefined): Promise<void> {
  if (!themeApplier || !workspaceManager) {
    return;
  }

  const result = await themeApplier.applyTheme(branchName);
  
  if (result.needsReopen) {
    // Not in a Themetree workspace, need to prompt for reopen
    const folderPath = workspaceManager.getOriginalFolderPath();
    
    if (!folderPath) {
      return;
    }

    // Check if we've already prompted for this folder
    if (workspaceManager.hasBeenPrompted(folderPath)) {
      return;
    }

    // Check if a workspace file already exists (user might have closed and reopened)
    if (workspaceManager.workspaceFileExists(folderPath)) {
      // Workspace file exists, prompt to reopen it
      const result = await vscode.window.showInformationMessage(
        'Themetree: A Themetree workspace exists for this folder. Reopen to enable per-window colors?',
        'Reopen',
        'Not Now'
      );
      
      if (result === 'Reopen') {
        const workspacePath = workspaceManager.getThemetreeWorkspacePath(folderPath);
        const workspaceUri = vscode.Uri.file(workspacePath);
        await vscode.commands.executeCommand('vscode.openFolder', workspaceUri);
      }
    } else {
      // First time - prompt to create and reopen
      await workspaceManager.promptReopenAsWorkspace(folderPath);
    }
  }
}

/**
 * Extension deactivation.
 * Called when the extension is deactivated.
 */
export function deactivate(): void {
  console.log('Themetree: Deactivating...');
  branchWatcher?.dispose();
}
