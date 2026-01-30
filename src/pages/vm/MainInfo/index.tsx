import React from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Typography,
  Flex,
  Select,
  Row,
  Col,
} from 'antd';

const {Title, Text} = Typography;

const MainInfo: React.FC = () => {
  return (
    <Card
      title={
        <Flex vertical gap={4} style={{paddingBottom: 10}}>
          <Title level={4} style={{margin: 0, paddingTop: 16}}>
            Основная информация
          </Title>
          <Text type="secondary">
            Заполните обязательные поля для создания виртуальной машины
          </Text>
        </Flex>
      }
    >
      <Row gutter={16}>
        <Col span={12}>
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
        </Col>
        <Col span={12}>
          <Form.Item label="Описание" name="description">
            <Input.TextArea
              placeholder="Введите описание виртуальной машины"
              autoSize={{minRows: 2}}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Количество CPU"
            name="cpuCount"
            style={{marginBottom: 0}}
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
        </Col>
        <Col span={8}>
          <Form.Item
            label="Объём RAM"
            name="ramSize"
            style={{marginBottom: 0}}
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
        </Col>
        <Col span={8}>
          <Form.Item
            label="Chipset"
            name="chipset"
            style={{marginBottom: 0}}
            rules={[
              {
                required: true,
                message: 'Пожалуйста, выберите chipset',
              },
            ]}
          >
            <Select
              placeholder="Выберите chipset"
              options={[
                {label: 'q35', value: 'q35'},
                {label: 'i440', value: 'i440'},
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default MainInfo;
