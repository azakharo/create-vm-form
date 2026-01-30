import {InputNumber, type InputNumberProps} from 'antd';
import type {FC} from 'react';

export const IntegerInput: FC<InputNumberProps> = props => {
  return (
    <InputNumber
      type="number"
      precision={0}
      onKeyDown={e => {
        if (['.', ',', 'e', '+'].includes(e.key)) {
          e.preventDefault();
        }
      }}
      {...props}
    />
  );
};
