import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { generateWorkspaceName } from './friendlyName';

// Themetree workspace storage location
const THEMETREE_DIR = path.join(os.homedir(), '.themetree', 'workspaces');

interface CodeWorkspace {
  folders: { path: string }[];
  settings?: Record<string, unknown>;
}

/**
 * Manages external .code-workspace files for per-window colors without modifying repo files.
 * Also supports direct .vscode/settings.json mode when useWorkspaceFile is false.
 */
export class WorkspaceManager {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  /**
   * Check if workspace file mode is enabled.
   */
  isWorkspaceFileMode(): boolean {
    const config = vscode.workspace.getConfiguration('themetree');
    return config.get<boolean>('useWorkspaceFile', true);
  }

  /**
   * Get the path to the Themetree workspace file for a given folder.
   * Uses friendly names like "projectName-swift-falcon.code-workspace".
   */
  getThemetreeWorkspacePath(folderPath: string): string {
    // Check if we already have a workspace file for this folder
    const existingPath = this.findExistingWorkspaceFor(folderPath);
    if (existingPath) {
      return existingPath;
    }
    
    // Generate a new friendly name based on project folder name
    const projectName = path.basename(folderPath);
    const existingNames = this.getExistingWorkspaceNames();
    const workspaceName = generateWorkspaceName(projectName, existingNames);
    return path.join(THEMETREE_DIR, `${workspaceName}.code-workspace`);
  }

  /**
   * Get all existing workspace names in the Themetree directory.
   */
  private getExistingWorkspaceNames(): Set<string> {
    const names = new Set<string>();
    if (!fs.existsSync(THEMETREE_DIR)) {
      return names;
    }
    for (const file of fs.readdirSync(THEMETREE_DIR)) {
      if (file.endsWith('.code-workspace')) {
        names.add(file.replace('.code-workspace', ''));
      }
    }
    return names;
  }

  /**
   * Find an existing workspace file that points to the given folder.
   */
  private findExistingWorkspaceFor(folderPath: string): string | undefined {
    if (!fs.existsSync(THEMETREE_DIR)) {
      return undefined;
    }
    for (const file of fs.readdirSync(THEMETREE_DIR)) {
      if (!file.endsWith('.code-workspace')) continue;
      const filePath = path.join(THEMETREE_DIR, file);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const workspace: CodeWorkspace = JSON.parse(content);
        if (workspace.folders?.[0]?.path === folderPath) {
          return filePath;
        }
      } catch {
        continue;
      }
    }
    return undefined;
  }

  /**
   * Check if the current workspace is a Themetree-managed workspace.
   */
  isThemetreeWorkspace(): boolean {
    const workspaceFile = vscode.workspace.workspaceFile;
    if (!workspaceFile) {
      return false;
    }
    return workspaceFile.fsPath.startsWith(THEMETREE_DIR);
  }

  /**
   * Get the original folder path from a Themetree workspace.
   * Returns undefined if not a Themetree workspace or folder can't be determined.
   */
  getOriginalFolderPath(): string | undefined {
    if (!this.isThemetreeWorkspace()) {
      // If it's a regular folder workspace, return the first folder
      const folders = vscode.workspace.workspaceFolders;
      if (folders && folders.length > 0) {
        return folders[0].uri.fsPath;
      }
      return undefined;
    }

    // Read the workspace file to get the folder path
    const workspaceFile = vscode.workspace.workspaceFile;
    if (!workspaceFile) {
      return undefined;
    }

    try {
      const content = fs.readFileSync(workspaceFile.fsPath, 'utf-8');
      const workspace: CodeWorkspace = JSON.parse(content);
      if (workspace.folders && workspace.folders.length > 0) {
        return workspace.folders[0].path;
      }
    } catch {
      console.error('Themetree: Failed to read workspace file');
    }

    return undefined;
  }

  /**
   * Check if user has already been prompted for this folder.
   */
  hasBeenPrompted(folderPath: string): boolean {
    const prompted = this.context.globalState.get<string[]>('themetree.promptedFolders', []);
    return prompted.includes(folderPath);
  }

  /**
   * Mark a folder as prompted.
   */
  async markAsPrompted(folderPath: string): Promise<void> {
    const prompted = this.context.globalState.get<string[]>('themetree.promptedFolders', []);
    if (!prompted.includes(folderPath)) {
      prompted.push(folderPath);
      await this.context.globalState.update('themetree.promptedFolders', prompted);
    }
  }

  /**
   * Create or update the Themetree workspace file with colors.
   */
  async createOrUpdateWorkspace(
    folderPath: string,
    colorCustomizations: Record<string, string>
  ): Promise<string> {
    // Ensure the directory exists
    if (!fs.existsSync(THEMETREE_DIR)) {
      fs.mkdirSync(THEMETREE_DIR, { recursive: true });
    }

    const workspacePath = this.getThemetreeWorkspacePath(folderPath);

    let workspace: CodeWorkspace;

    // Read existing or create new
    if (fs.existsSync(workspacePath)) {
      try {
        const content = fs.readFileSync(workspacePath, 'utf-8');
        workspace = JSON.parse(content);
      } catch {
        workspace = { folders: [{ path: folderPath }], settings: {} };
      }
    } else {
      workspace = { folders: [{ path: folderPath }], settings: {} };
    }

    // Ensure settings object exists
    if (!workspace.settings) {
      workspace.settings = {};
    }

    // Set window title to just show the project name (removes hash and "(Workspace)" suffix)
    const folderName = path.basename(folderPath);
    workspace.settings['window.title'] = folderName + '${separator}${activeEditorShort}${dirty}';

    // Update color customizations
    if (Object.keys(colorCustomizations).length > 0) {
      workspace.settings['workbench.colorCustomizations'] = colorCustomizations;
    } else {
      delete workspace.settings['workbench.colorCustomizations'];
    }

    // Write the workspace file
    fs.writeFileSync(workspacePath, JSON.stringify(workspace, null, 2));

    return workspacePath;
  }

  /**
   * Clear colors from the Themetree workspace file.
   */
  async clearWorkspaceColors(folderPath: string): Promise<void> {
    const workspacePath = this.getThemetreeWorkspacePath(folderPath);

    if (!fs.existsSync(workspacePath)) {
      return;
    }

    try {
      const content = fs.readFileSync(workspacePath, 'utf-8');
      const workspace: CodeWorkspace = JSON.parse(content);

      if (workspace.settings) {
        delete workspace.settings['workbench.colorCustomizations'];
      }

      fs.writeFileSync(workspacePath, JSON.stringify(workspace, null, 2));
    } catch (error) {
      console.error('Themetree: Failed to clear workspace colors', error);
    }
  }

  /**
   * Prompt the user to reopen as a Themetree workspace.
   */
  async promptReopenAsWorkspace(folderPath: string): Promise<boolean> {
    const workspacePath = this.getThemetreeWorkspacePath(folderPath);

    const result = await vscode.window.showInformationMessage(
      'Themetree: Reopen as Themetree workspace for per-window colors? (Your repo files won\'t be modified)',
      'Reopen',
      'Not Now',
      'Never for this folder'
    );

    if (result === 'Reopen') {
      // Create the workspace file first (colors will be applied after reopen)
      await this.createOrUpdateWorkspace(folderPath, {});
      
      // Open the workspace file
      const workspaceUri = vscode.Uri.file(workspacePath);
      await vscode.commands.executeCommand('vscode.openFolder', workspaceUri);
      return true;
    } else if (result === 'Never for this folder') {
      await this.markAsPrompted(folderPath);
    }

    return false;
  }

  /**
   * Check if a Themetree workspace file exists for the given folder.
   */
  workspaceFileExists(folderPath: string): boolean {
    const workspacePath = this.getThemetreeWorkspacePath(folderPath);
    return fs.existsSync(workspacePath);
  }

  /**
   * Apply colors directly to .vscode/settings.json (non-workspace mode).
   */
  async applyColorsToSettings(colorCustomizations: Record<string, string>): Promise<void> {
    const config = vscode.workspace.getConfiguration('workbench');
    
    if (Object.keys(colorCustomizations).length > 0) {
      await config.update('colorCustomizations', colorCustomizations, vscode.ConfigurationTarget.Workspace);
    } else {
      await config.update('colorCustomizations', undefined, vscode.ConfigurationTarget.Workspace);
    }
  }

  /**
   * Clear colors from .vscode/settings.json.
   */
  async clearSettingsColors(): Promise<void> {
    const config = vscode.workspace.getConfiguration('workbench');
    await config.update('colorCustomizations', undefined, vscode.ConfigurationTarget.Workspace);
  }
}




