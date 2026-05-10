import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { ConsentManager } from "./consent-manager.js";
import type { McpLifecycleManager } from "./lifecycle.js";
import type { McpServerManager } from "./server-manager.js";
import type { ToolMetadata, McpConfig } from "./types.js";

export type SendMessageFn = (
  message: {
    customType: string;
    content: Array<{ type: string; text: string }>;
    display?: string;
    details?: unknown;
  },
  options?: { triggerTurn?: boolean }
) => void;

export interface McpExtensionState {
  manager: McpServerManager;
  lifecycle: McpLifecycleManager;
  toolMetadata: Map<string, ToolMetadata[]>;
  config: McpConfig;
  failureTracker: Map<string, number>;
  consentManager: ConsentManager;
  openBrowser: (url: string) => Promise<void>;
  ui?: ExtensionContext["ui"];
  sendMessage?: SendMessageFn;
}
