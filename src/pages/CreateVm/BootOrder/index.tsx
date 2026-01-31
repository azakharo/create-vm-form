import {Form} from 'antd';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {useEffect} from 'react';
import type {CreateVmFormValues} from '../types';
import {BootOrderItem} from './BootOrderItem';

export const BootOrder: React.FC = () => {
  const form = Form.useFormInstance<CreateVmFormValues>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hddDisks = Form.useWatch('hddDisks', form) || [];
  const bootOrder = Form.useWatch('bootOrder', form) || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Synchronize boot order with hddDisks changes
  useEffect(() => {
    const currentBootOrder =
      (form.getFieldValue('bootOrder') as string[]) || [];
    const diskIds = hddDisks.map(disk => disk.id);

    // Remove disks that no longer exist
    const filteredBootOrder = currentBootOrder.filter((id: string) =>
      diskIds.includes(id),
    );

    // Add new disks to the end of boot order
    const newDiskIds = diskIds.filter(id => !currentBootOrder.includes(id));
    const updatedBootOrder = [...filteredBootOrder, ...newDiskIds];

    // Only update if there's a change
    if (JSON.stringify(updatedBootOrder) !== JSON.stringify(currentBootOrder)) {
      form.setFieldValue('bootOrder', updatedBootOrder);
    }
  }, [hddDisks, form]);

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if (over && active.id !== over.id) {
      const oldIndex = bootOrder.indexOf(active.id as string);
      const newIndex = bootOrder.indexOf(over.id as string);

      const newBootOrder = arrayMove(bootOrder, oldIndex, newIndex);
      form.setFieldValue('bootOrder', newBootOrder);
    }
  };

  // Get disk objects in boot order
  const orderedDisks = bootOrder
    .map(id => hddDisks.find(disk => disk.id === id))
    .filter(Boolean);

  return (
    <Form.Item name="bootOrder">
      <div style={{marginBottom: '24px'}}>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 500,
            marginBottom: '16px',
            color: '#262626',
          }}
        >
          Порядок загрузки
        </div>

        {orderedDisks.length === 0 ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              color: '#8c8c8c',
              backgroundColor: '#fafafa',
              border: '1px dashed #d9d9d9',
              borderRadius: '6px',
            }}
          >
            Нет дисков для отображения
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={bootOrder}
              strategy={verticalListSortingStrategy}
            >
              {orderedDisks.map(disk => (
                <BootOrderItem key={disk!.id} id={disk!.id} name={disk!.name} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </Form.Item>
  );
};
