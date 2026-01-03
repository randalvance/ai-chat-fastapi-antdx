import { ConfigProvider, theme } from 'antd';
import Chat from './components/Chat';
import './App.css';

function App() {
  return (
    <ConfigProvider
      theme={{ algorithm: theme.darkAlgorithm }}
    >
      <Chat />
    </ConfigProvider>
  );
}

export default App;
