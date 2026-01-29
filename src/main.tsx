import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {ConfigProvider} from 'antd';
import 'antd/dist/reset.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        cssVar: {
          prefix: 'create-campaign',
          key: 'light',
        },
        token: {
          colorPrimary: '#ff6f00',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
);
