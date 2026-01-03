import React from 'react';
import { Bubble, Sender } from '@ant-design/x';
import { UserOutlined, RobotOutlined, LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { useChat } from '../hooks/useChat';
import styles from './Chat.module.css';

const Chat: React.FC = () => {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();

  const renderContent = (msg: typeof messages[0]) => (
    <div>
      {msg.toolStatus && (
        <div className={styles.toolStatus}>
          {msg.toolStatus.status === 'running' ? (
            <><LoadingOutlined /> Running {msg.toolStatus.name}...</>
          ) : (
            <><CheckCircleOutlined /> {msg.toolStatus.name} completed</>
          )}
        </div>
      )}
      <div>{msg.content}</div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>AI Chat</h1>
        {messages.length > 0 && (
          <button onClick={clearMessages} disabled={isLoading}>Clear</button>
        )}
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.empty}>
            <RobotOutlined style={{ fontSize: 48 }} />
            <p>Start a conversation</p>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <Bubble
                key={msg.key}
                placement={msg.role === 'user' ? 'end' : 'start'}
                variant={msg.role === 'user' ? 'filled' : 'outlined'}
                avatar={
                  msg.role === 'user' 
                    ? <Avatar icon={<UserOutlined />} style={{ background: '#1677ff' }} />
                    : <Avatar icon={<RobotOutlined />} style={{ background: '#52c41a' }} />
                }
                content={renderContent(msg)}
                loading={msg.loading && !msg.content}
                styles={{
                  content: {
                    color: msg.role === 'user' ? '#fff' : 'rgba(255, 255, 255, 0.85)'
                  }
                }}
              />
            ))}
          </>
        )}
      </div>
      <div className={styles.sender}>
        <Sender
          placeholder="Type a message..."
          onSubmit={sendMessage}
          loading={isLoading}
          styles={{
            input: {
              color: 'rgba(255, 255, 255, 0.85)'
            }
          }}
        />
      </div>
    </div>
  );
};

export default Chat;
