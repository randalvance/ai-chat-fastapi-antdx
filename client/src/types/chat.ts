export type MessageRole = 'user' | 'assistant';

export type ChatMessage = {
  role: MessageRole;
  content: string;
};

export type ToolStatus = {
  name: string;
  status: 'running' | 'completed' | 'error';
  input?: string;
  output?: string;
};

export type BubbleMessage = {
  key: string;
  role: MessageRole;
  content: string;
  toolStatus?: ToolStatus;
  loading?: boolean;
};

export type StreamEvent =
  | { type: 'token'; content: string }
  | { type: 'tool_start'; tool: string; input: string }
  | { type: 'tool_end'; tool: string; output: string }
  | { type: 'done' }
  | { type: 'error'; message: string };
