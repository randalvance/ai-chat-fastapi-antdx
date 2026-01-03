import type { ChatMessage, StreamEvent } from '../types/chat';
import { API_ENDPOINTS } from '../config/api';

export async function* streamChat(
  messages: ChatMessage[]
): AsyncGenerator<StreamEvent, void, unknown> {
  const response = await fetch(API_ENDPOINTS.CHAT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (!response.body) throw new Error('No response body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const event: StreamEvent = JSON.parse(line.slice(6));
        yield event;
        if (event.type === 'done' || event.type === 'error') return;
      }
    }
  }
}
