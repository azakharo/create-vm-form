import {type FC, type PropsWithChildren} from 'react';
import {ConfigProvider} from 'antd';

export const Providers: FC<PropsWithChildren> = ({children}) => {
  return (
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
      {children}
    </ConfigProvider>
  );
};
