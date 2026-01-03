import { useState, useCallback } from 'react';
import type { BubbleMessage, ChatMessage, ToolStatus } from '../types/chat';
import { streamChat } from '../services/chatService';

let msgId = 0;
const genId = () => `msg_${Date.now()}_${++msgId}`;

export function useChat() {
  const [messages, setMessages] = useState<BubbleMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;
    setError(null);

    const userMsg: BubbleMessage = { key: genId(), role: 'user', content };
    const assistantKey = genId();
    const assistantMsg: BubbleMessage = {
      key: assistantKey,
      role: 'assistant',
      content: '',
      loading: true,
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setIsLoading(true);

    try {
      const chatHistory: ChatMessage[] = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      let accContent = '';
      let toolStatus: ToolStatus | undefined;

      for await (const event of streamChat(chatHistory)) {
        if (event.type === 'token') {
          accContent += event.content;
          setMessages(prev =>
            prev.map(m =>
              m.key === assistantKey
                ? { ...m, content: accContent, toolStatus }
                : m
            )
          );
        } else if (event.type === 'tool_start') {
          toolStatus = { name: event.tool, status: 'running', input: event.input };
          setMessages(prev =>
            prev.map(m =>
              m.key === assistantKey ? { ...m, toolStatus } : m
            )
          );
        } else if (event.type === 'tool_end') {
          toolStatus = { ...toolStatus!, status: 'completed', output: event.output };
          setMessages(prev =>
            prev.map(m =>
              m.key === assistantKey ? { ...m, toolStatus } : m
            )
          );
        } else if (event.type === 'done') {
          setMessages(prev =>
            prev.map(m =>
              m.key === assistantKey ? { ...m, loading: false } : m
            )
          );
        } else if (event.type === 'error') {
          throw new Error(event.message);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setMessages(prev => prev.filter(m => m.key !== assistantKey));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}
