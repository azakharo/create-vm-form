import {Button, Layout, Typography, Form, Space} from 'antd';
import type {CreateVmFormValues} from './types';

const {Header, Content} = Layout;
const {Title} = Typography;

export const CreateVmPage = () => {
  const [form] = Form.useForm<CreateVmFormValues>();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(values => {
        // Log the form state (values entered by the user)
        console.log('Form values:', values);
      })
      .catch(error => {
        console.log('Validation failed:', error);
      });
  };

  const handleCancel = () => {
    // Navigate back without saving
    window.history.back();
  };

  return (
    <Layout style={{minHeight: '100vh'}}>
      <Header
        style={{
          backgroundColor: '#fff',
          padding: '0 24px',
          borderBottom: '1px solid #e8e8e8',
          height: 'auto',
        }}
      >
        <Space style={{height: '64px', alignItems: 'center'}}>
          <Button type="text" onClick={handleCancel}>
            &larr;
          </Button>
          <Title level={2} style={{margin: 0, fontSize: '20px'}}>
            Создать ВМ
          </Title>
        </Space>
      </Header>

      <Content style={{padding: '24px'}}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          scrollToFirstError={{
            block: 'center',
            behavior: 'smooth',
          }}
          initialValues={{
            name: '',
          }}
        >
          Here will be the Content
          {/* Action buttons */}
          <Form.Item style={{marginTop: '24px'}}>
            <Space>
              <Button type="primary" htmlType="submit">
                Создать
              </Button>

              <Button type="text" onClick={handleCancel}>
                Отмена
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};
