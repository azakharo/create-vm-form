import React, {useEffect} from 'react';
import {Card, Form, Typography, Flex, Button} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import type {HddDisk} from '../types';
import HddDiskComponent from './HddDisk';

const {Title, Text} = Typography;

const HddDisks: React.FC = () => {
  const form = Form.useFormInstance();

  const chipset = Form.useWatch('chipset', form) as 'q35' | 'i440' | undefined;

  // Handle chipset change - convert IDE to SCSI
  useEffect(() => {
    if (chipset === 'q35') {
      const disks = (form.getFieldValue('hddDisks') as HddDisk[]) || [];
      const updatedDisks = disks.map((disk: HddDisk) =>
        disk.diskInterface === 'IDE' ? {...disk, diskInterface: 'SCSI'} : disk,
      );
      form.setFieldValue('hddDisks', updatedDisks);
    }
  }, [chipset, form]);

  return (
    <Card
      title={
        <Flex vertical gap={4} style={{paddingBottom: 10}}>
          <Title level={4} style={{margin: 0, paddingTop: 16}}>
            Диски HDD
          </Title>
          <Text type="secondary">
            Добавьте минимум один диск для виртуальной машины
          </Text>
        </Flex>
      }
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            const disks = (form.getFieldValue('hddDisks') as HddDisk[]) || [];
            const nextIndex = disks.length + 1;
            form.setFieldValue('hddDisks', [
              ...disks,
              {
                name: `disk-${nextIndex}`,
                enabled: true,
                size: 128,
                diskInterface: 'SCSI',
              },
            ]);
          }}
        >
          Добавить диск
        </Button>
      }
    >
      <Form.List
        name="hddDisks"
        rules={[
          {
            validator: async (_, disks) => {
              if (!disks || (disks as HddDisk[]).length === 0) {
                return Promise.reject(
                  new Error('Минимум 1 HDD диск требуется'),
                );
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        {(fields, {remove}) => (
          <>
            {fields.map((field, index) => (
              <HddDiskComponent
                key={field.key}
                field={field}
                index={index}
                remove={remove}
                chipset={chipset || 'q35'}
              />
            ))}
          </>
        )}
      </Form.List>
    </Card>
  );
};

export default HddDisks;
