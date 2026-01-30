import React from 'react';
import {Card, Form, Input, InputNumber, Typography, Flex} from 'antd';

const {Title, Text} = Typography;

const MainInfo: React.FC = () => {
  return (
    <Card
      title={
        <Flex vertical gap={4}>
          <Title level={4} style={{margin: 0}}>
            Основная информация
          </Title>
          <Text type="secondary">
            Заполните обязательные поля для создания виртуальной машины
          </Text>
        </Flex>
      }
    >
      <Form.Item
        label="Имя"
        name="name"
        rules={[
          {
            required: true,
            message: 'Пожалуйста, введите имя виртуальной машины',
          },
        ]}
      >
        <Input placeholder="Введите имя виртуальной машины" />
      </Form.Item>

      <Form.Item label="Описание" name="description">
        <Input.TextArea
          placeholder="Введите описание виртуальной машины"
          autoSize={{minRows: 2}}
        />
      </Form.Item>

      <Form.Item
        label="Количество CPU"
        name="cpuCount"
        rules={[
          {
            required: true,
            message: 'Пожалуйста, введите количество CPU',
          },
          {
            type: 'number',
            min: 1,
            max: 10,
            message: 'Количество CPU должно быть от 1 до 10',
          },
        ]}
      >
        <InputNumber
          min={1}
          max={10}
          placeholder="Введите количество CPU"
          style={{width: '100%'}}
        />
      </Form.Item>

      <Form.Item
        label="Объём RAM"
        name="ramSize"
        rules={[
          {
            required: true,
            message: 'Пожалуйста, введите объём RAM',
          },
          {
            type: 'number',
            min: 1,
            max: 256,
            message: 'Объём RAM должен быть от 1 до 256 ГБ',
          },
        ]}
      >
        <InputNumber
          min={1}
          max={256}
          placeholder="Введите объём RAM"
          suffix="ГБ"
          style={{width: '100%'}}
        />
      </Form.Item>
    </Card>
  );
};

export default MainInfo;
