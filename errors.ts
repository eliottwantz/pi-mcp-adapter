export interface McpErrorContext {
  server?: string;
  tool?: string;
  uri?: string;
  session?: string;
  [key: string]: unknown;
}

export class McpError extends Error {
  readonly code: string;
  readonly context: McpErrorContext;
  readonly recoveryHint?: string;
  readonly cause?: Error;

  constructor(
    message: string,
    options: {
      code: string;
      context?: McpErrorContext;
      recoveryHint?: string;
      cause?: Error;
    }
  ) {
    super(message);
    this.name = "McpError";
    this.code = options.code;
    this.context = options.context ?? {};
    this.recoveryHint = options.recoveryHint;
    this.cause = options.cause;
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      recoveryHint: this.recoveryHint,
    };
  }
}

export class ConsentError extends McpError {
  constructor(serverName: string, context?: McpErrorContext) {
    const denied = context?.denied === true;
    super(
      denied
        ? `Tool calls for "${serverName}" were denied for this session`
        : `Tool call approval required for "${serverName}"`,
      {
        code: denied ? "CONSENT_DENIED" : "CONSENT_REQUIRED",
        context: { server: serverName, ...context },
        recoveryHint: denied ? "Clear consent and approve the tool call to continue" : "Approve the tool call to continue",
      },
    );
    this.name = "ConsentError";
  }
}

export function wrapError(error: unknown, context?: McpErrorContext): McpError {
  if (error instanceof McpError) {
    return new McpError(error.message, {
      code: error.code,
      context: { ...error.context, ...context },
      recoveryHint: error.recoveryHint,
      cause: error.cause,
    });
  }

  const message = error instanceof Error ? error.message : String(error);
  return new McpError(message, {
    code: "UNKNOWN_ERROR",
    context,
    cause: error instanceof Error ? error : undefined,
  });
}

export function isMcpError(error: unknown, code?: string): error is McpError {
  if (!(error instanceof McpError)) return false;
  return code === undefined || error.code === code;
}
