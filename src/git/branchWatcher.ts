import * as vscode from 'vscode';

/**
 * Git extension API types (simplified)
 */
interface GitExtension {
  getAPI(version: number): GitAPI;
}

interface GitAPI {
  repositories: Repository[];
  onDidOpenRepository: vscode.Event<Repository>;
}

interface Repository {
  state: RepositoryState;
  onDidChangeState: vscode.Event<RepositoryState>;
}

interface RepositoryState {
  HEAD?: {
    name?: string;
    commit?: string;
    type?: number;
  };
}

export type BranchChangeHandler = (branchName: string | undefined) => void;

/**
 * Watches for git branch changes in the current workspace.
 */
export class BranchWatcher {
  private gitAPI: GitAPI | undefined;
  private disposables: vscode.Disposable[] = [];
  private onBranchChange: BranchChangeHandler;
  private currentBranch: string | undefined;

  constructor(onBranchChange: BranchChangeHandler) {
    this.onBranchChange = onBranchChange;
  }

  /**
   * Initialize the watcher by connecting to VSCode's git extension.
   */
  async initialize(): Promise<void> {
    const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git');
    
    if (!gitExtension) {
      console.log('Themetree: Git extension not found');
      return;
    }

    if (!gitExtension.isActive) {
      await gitExtension.activate();
    }

    this.gitAPI = gitExtension.exports.getAPI(1);
    
    // Watch existing repositories
    for (const repo of this.gitAPI.repositories) {
      this.watchRepository(repo);
    }

    // Watch for new repositories being opened
    this.disposables.push(
      this.gitAPI.onDidOpenRepository((repo) => {
        this.watchRepository(repo);
      })
    );

    // Get initial branch
    this.checkCurrentBranch();
  }

  /**
   * Watch a repository for state changes.
   */
  private watchRepository(repo: Repository): void {
    this.disposables.push(
      repo.onDidChangeState(() => {
        this.checkCurrentBranch();
      })
    );
  }

  /**
   * Check the current branch and notify if changed.
   */
  private checkCurrentBranch(): void {
    const branchName = this.getCurrentBranch();
    
    if (branchName !== this.currentBranch) {
      this.currentBranch = branchName;
      this.onBranchChange(branchName);
    }
  }

  /**
   * Get the current branch name.
   */
  getCurrentBranch(): string | undefined {
    if (!this.gitAPI || this.gitAPI.repositories.length === 0) {
      return undefined;
    }

    // Use the first repository (primary workspace)
    const repo = this.gitAPI.repositories[0];
    return repo.state.HEAD?.name;
  }

  /**
   * Force a refresh of the current branch.
   */
  refresh(): void {
    this.currentBranch = undefined; // Reset to force notification
    this.checkCurrentBranch();
  }

  /**
   * Clean up resources.
   */
  dispose(): void {
    for (const d of this.disposables) {
      d.dispose();
    }
    this.disposables = [];
  }
}

