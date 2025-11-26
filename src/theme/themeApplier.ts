import * as vscode from 'vscode';
import { ThemeColors, COLOR_PALETTE, getThemeByIndex } from './colorPalette';
import { hashString, hashToIndex } from '../utils/hash';
import { WorkspaceManager } from '../workspace/workspaceManager';

type Intensity = 'subtle' | 'medium' | 'vibrant';

/**
 * Applies theme colors to the workspace based on branch name.
 * Uses external .code-workspace files to avoid modifying repo files.
 */
export class ThemeApplier {
  private context: vscode.ExtensionContext;
  private workspaceManager: WorkspaceManager;

  constructor(context: vscode.ExtensionContext, workspaceManager: WorkspaceManager) {
    this.context = context;
    this.workspaceManager = workspaceManager;
  }

  /**
   * Apply theme colors for a given branch name.
   * Returns true if colors were applied, false if workspace reopen is needed.
   */
  async applyTheme(branchName: string | undefined): Promise<{ applied: boolean; needsReopen: boolean }> {
    // Don't try to apply if no workspace is open
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
      console.log('Themetree: No workspace open, skipping theme application');
      return { applied: false, needsReopen: false };
    }

    const config = vscode.workspace.getConfiguration('themetree');
    const enabled = config.get<boolean>('enabled', true);
    
    if (!enabled) {
      return { applied: false, needsReopen: false };
    }

    const intensity = config.get<Intensity>('intensity', 'medium');
    const defaultBranches = config.get<string[]>('defaultBranches', ['main', 'master', 'develop', 'dev']);
    const excludedBranches = config.get<string[]>('excludedBranches', []);

    // No branch, default branch, or excluded branch = clear theme
    if (!branchName || 
        defaultBranches.includes(branchName) || 
        this.isExcluded(branchName, excludedBranches)) {
      await this.clearColors(true); // Silent clear
      return { applied: false, needsReopen: false };
    }

    // Check if we're in a Themetree workspace
    if (!this.workspaceManager.isThemetreeWorkspace()) {
      // Not in a Themetree workspace - we need to prompt for reopen
      return { applied: false, needsReopen: true };
    }

    // Hash branch name to get a color
    const hash = hashString(branchName);
    const index = hashToIndex(hash, COLOR_PALETTE.length);
    const theme = getThemeByIndex(index);

    await this.applyColors(theme, intensity);
    
    // Show notification on theme change
    vscode.window.setStatusBarMessage(`Themetree: ${theme.name} theme applied`, 3000);
    
    return { applied: true, needsReopen: false };
  }

  /**
   * Check if a branch matches any exclusion pattern.
   * Supports wildcards like 'release/*'
   */
  private isExcluded(branchName: string, patterns: string[]): boolean {
    for (const pattern of patterns) {
      if (this.matchesPattern(branchName, pattern)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Simple wildcard pattern matching.
   * Converts 'release/*' to regex 'release/.*'
   */
  private matchesPattern(branchName: string, pattern: string): boolean {
    const regexPattern = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&') // Escape regex special chars
      .replace(/\*/g, '.*')                   // Convert * to .*
      .replace(/\?/g, '.');                   // Convert ? to .
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(branchName);
  }

  /**
   * Apply the color customizations to the external workspace file.
   */
  private async applyColors(theme: ThemeColors, intensity: Intensity): Promise<void> {
    const colors = this.generateColorCustomizations(theme, intensity);
    const folderPath = this.workspaceManager.getOriginalFolderPath();
    
    if (!folderPath) {
      console.error('Themetree: Could not determine folder path');
      return;
    }

    await this.workspaceManager.createOrUpdateWorkspace(folderPath, colors);
  }

  /**
   * Generate color customizations based on theme and intensity.
   */
  private generateColorCustomizations(theme: ThemeColors, intensity: Intensity): Record<string, string> {
    // Base colors that are always applied
    const baseColors: Record<string, string> = {
      // Title bar
      'titleBar.activeBackground': theme.primaryDark,
      'titleBar.activeForeground': theme.foreground,
      'titleBar.inactiveBackground': this.darken(theme.primaryDark, 0.3),
      'titleBar.inactiveForeground': this.fade(theme.foreground, 0.6),
      
      // Status bar
      'statusBar.background': theme.primary,
      'statusBar.foreground': theme.foreground,
      'statusBar.noFolderBackground': theme.primaryDark,
      'statusBar.debuggingBackground': this.lighten(theme.primary, 0.1),
      'statusBar.debuggingForeground': theme.foreground,
    };

    // Medium intensity adds activity bar
    if (intensity === 'medium' || intensity === 'vibrant') {
      Object.assign(baseColors, {
        'activityBar.background': theme.primaryDark,
        'activityBar.foreground': theme.foreground,
        'activityBar.inactiveForeground': this.fade(theme.foreground, 0.5),
        'activityBarBadge.background': theme.primary,
        'activityBarBadge.foreground': theme.foreground,
      });
    }

    // Vibrant intensity adds more elements
    if (intensity === 'vibrant') {
      Object.assign(baseColors, {
        // Side bar border
        'sideBar.border': theme.primary,
        
        // Tab styling
        'tab.activeBorderTop': theme.primary,
        'tab.unfocusedActiveBorderTop': this.fade(theme.primary, 0.5),
        
        // Panel border
        'panel.border': theme.primary,
        
        // Editor line highlight
        'editor.lineHighlightBackground': this.fade(theme.primary, 0.1),
      });
    }

    return baseColors;
  }

  /**
   * Clear all Themetree color customizations.
   */
  async clearColors(silent: boolean = false): Promise<void> {
    // Don't try to clear if no workspace is open
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
      return;
    }

    const folderPath = this.workspaceManager.getOriginalFolderPath();
    
    if (!folderPath) {
      if (!silent) {
        vscode.window.showInformationMessage('Themetree: No colors to clear');
      }
      return;
    }

    await this.workspaceManager.clearWorkspaceColors(folderPath);
    
    if (!silent) {
      vscode.window.showInformationMessage('Themetree: Colors cleared');
    }
  }

  /**
   * Darken a hex color by a factor.
   */
  private darken(hex: string, factor: number): string {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;
    
    return this.rgbToHex(
      Math.round(rgb.r * (1 - factor)),
      Math.round(rgb.g * (1 - factor)),
      Math.round(rgb.b * (1 - factor))
    );
  }

  /**
   * Lighten a hex color by a factor.
   */
  private lighten(hex: string, factor: number): string {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;
    
    return this.rgbToHex(
      Math.round(rgb.r + (255 - rgb.r) * factor),
      Math.round(rgb.g + (255 - rgb.g) * factor),
      Math.round(rgb.b + (255 - rgb.b) * factor)
    );
  }

  /**
   * Fade a hex color (reduce opacity - returns #RRGGBBAA string).
   */
  private fade(hex: string, opacity: number): string {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;
    
    const alpha = Math.round(opacity * 255);
    return `#${[rgb.r, rgb.g, rgb.b, alpha].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
  }

  /**
   * Convert hex to RGB.
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Convert RGB to hex.
   */
  private rgbToHex(r: number, g: number, b: number): string {
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
  }
}
