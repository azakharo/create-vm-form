import React from 'react';
import {Form, InputNumber, Select, Switch, Typography, Button} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import type {NamePath} from 'antd/es/form/interface';

const {Text} = Typography;

interface HddDiskProps {
  field: {name: NamePath; key: React.Key};
  index: number;
  remove: (index: number) => void;
  chipset: 'q35' | 'i440';
}

const HddDisk: React.FC<HddDiskProps> = ({field, index, remove, chipset}) => {
  const getInterfaceOptions = (): Array<{label: string; value: string}> => {
    const baseOptions = [
      {label: 'SCSI', value: 'SCSI'},
      {label: 'SATA', value: 'SATA'},
      {label: 'VIRTIO', value: 'VIRTIO'},
    ];

    if (chipset !== 'q35') {
      baseOptions.push({label: 'IDE', value: 'IDE'});
    }

    return baseOptions;
  };

  return (
    <div
      style={{
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <Text strong>Диск #{index + 1}</Text>
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => remove(index)}
          aria-label={`Удалить диск ${index + 1}`}
        />
      </div>

      {/* Name field - auto-generated, hidden */}
      <Form.Item name={[field.name, 'name']} hidden />

      {/* Enabled field */}
      <Form.Item
        label="Включен"
        name={[field.name, 'enabled']}
        valuePropName="checked"
        initialValue={true}
        rules={[{required: true, message: 'Обязательное поле'}]}
      >
        <Switch />
      </Form.Item>

      {/* Size field */}
      <Form.Item
        label="Размер"
        name={[field.name, 'size']}
        initialValue={128}
        rules={[
          {required: true, message: 'Обязательное поле'},
          {
            type: 'number',
            min: 1,
            max: 1024,
            message: 'Размер должен быть от 1 до 1024 ГБ',
          },
        ]}
      >
        <InputNumber min={1} max={1024} suffix="ГБ" style={{width: '100%'}} />
      </Form.Item>

      {/* Interface field */}
      <Form.Item
        label="Интерфейс"
        name={[field.name, 'diskInterface']}
        initialValue="SCSI"
        rules={[{required: true, message: 'Обязательное поле'}]}
      >
        <Select
          options={getInterfaceOptions()}
          placeholder="Выберите интерфейс"
        />
      </Form.Item>
    </div>
  );
};

export default HddDisk;
