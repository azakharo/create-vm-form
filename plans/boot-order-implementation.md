# Boot Order Section Implementation Plan

## Overview

This plan details the implementation of the "Порядок загрузки" (Boot Order) section for the VM creation form. The section will display disks from the HddDisks section in a vertical list with drag-n-drop reordering capabilities.

## 1. Type Definitions

### Changes to `src/pages/CreateVm/types.ts`

Add `bootOrder` field to `CreateVmFormValues` interface:

```typescript
export interface CreateVmFormValues {
  name: string;
  description: string;
  cpuCount: number;
  ramSize: number;
  chipset: 'q35' | 'i440';
  hddDisks: HddDisk[];
  bootOrder: string[]; // Array of disk IDs in boot priority order
}
```

**Rationale:**
- `bootOrder` stores an array of disk IDs (strings) representing the boot priority
- Using IDs instead of full disk objects ensures data consistency
- Empty array means no boot order specified (all disks can boot in any order)

### Initial Value Update

Update `initialValues` in `src/pages/CreateVm/index.tsx`:

```typescript
initialValues={{
  name: '',
  description: '',
  cpuCount: 1,
  ramSize: 4,
  chipset: 'q35',
  hddDisks: [],
  bootOrder: [], // Add this line
}}
```

## 2. Component Structure

### File Structure

```
src/pages/CreateVm/
├── BootOrder/
│   ├── index.tsx          # Main BootOrder component
│   ├── BootOrderItem.tsx  # Individual boot order item component
│   └── types.ts           # BootOrder-specific types (if needed)
```

### File Descriptions

**`index.tsx`** - Main BootOrder component
- Manages drag-n-drop context
- Handles synchronization with hddDisks
- Renders the list of bootable disks

**`BootOrderItem.tsx`** - Individual list item
- Displays disk name
- Provides drag handle
- Handles drag events

**`types.ts`** - (Optional)
- BootOrder-specific type definitions
- May not be needed if all types are in parent types.ts

## 3. Component Architecture

### Main BootOrder Component (`index.tsx`)

**Responsibilities:**
1. Watch `hddDisks` form field for changes
2. Synchronize `bootOrder` with `hddDisks`:
   - Add new disks to end of boot order
   - Remove deleted disks from boot order
   - Update disk names when changed
3. Set up @dnd-kit DndContext and SortableContext
4. Render list of BootOrderItem components
5. Handle drag end events to update boot order

**Props:** None (uses Form.useFormInstance() internally)

**State Management:**
- Uses `Form.useWatch('hddDisks')` to monitor disk changes
- Uses `Form.useWatch('bootOrder')` to monitor boot order changes
- Uses `useEffect` for synchronization logic

**Key Hooks:**
- `Form.useFormInstance()` - Access form instance
- `Form.useWatch('hddDisks')` - Watch disk changes
- `Form.useWatch('bootOrder')` - Watch boot order changes
- `useEffect` - Synchronization side effects
- `useSensors` - @dnd-kit sensor configuration

### BootOrderItem Component (`BootOrderItem.tsx`)

**Responsibilities:**
1. Display disk name
2. Provide drag handle for reordering
3. Handle drag events (onDragStart, onDragEnd)
4. Show visual feedback during drag

**Props:**
```typescript
interface BootOrderItemProps {
  id: string;           // Disk ID
  name: string;         // Disk name
  index: number;        // Position in list
  isDragging: boolean;  // Drag state
}
```

**State Management:**
- Uses `useSortable` hook from @dnd-kit/sortable
- Uses `CSS.Transform` for drag animations

**Key Hooks:**
- `useSortable` - @dnd-kit sortable functionality
- `CSS.Transform.toString()` - Apply drag transformations

## 4. Synchronization Logic

### Synchronization Strategy

The BootOrder component must maintain consistency between `hddDisks` and `bootOrder`:

```typescript
useEffect(() => {
  const disks = hddDisks || [];
  const currentBootOrder = bootOrder || [];

  // 1. Remove disks from bootOrder that no longer exist in hddDisks
  const validBootOrder = currentBootOrder.filter(id =>
    disks.some(disk => disk.id === id)
  );

  // 2. Add new disks to end of bootOrder
  const newDiskIds = disks
    .filter(disk => !currentBootOrder.includes(disk.id))
    .map(disk => disk.id);

  const updatedBootOrder = [...validBootOrder, ...newDiskIds];

  // 3. Update bootOrder if changed
  if (JSON.stringify(updatedBootOrder) !== JSON.stringify(currentBootOrder)) {
    form.setFieldValue('bootOrder', updatedBootOrder);
  }
}, [hddDisks, bootOrder, form]);
```

### Edge Cases to Handle

1. **Empty hddDisks array**
   - Result: bootOrder should be empty array

2. **All disks deleted**
   - Result: bootOrder should be cleared

3. **Disk name changed**
   - Result: bootOrder IDs remain unchanged (names are looked up dynamically)

4. **Disk ID collision**
   - Prevention: HddDisks component generates unique IDs (`disk-${nextIndex}`)
   - No action needed in BootOrder

5. **Boot order manually reordered**
   - Result: New order is preserved, synchronization only adds/removes disks

6. **Form reset**
   - Result: Both hddDisks and bootOrder reset to initial values

### Synchronization Timing

- Synchronization runs on every `hddDisks` change
- Does NOT run on `bootOrder` change (to avoid infinite loops)
- Uses `JSON.stringify` comparison to avoid unnecessary updates

## 5. Drag-n-Drop Implementation

### @dnd-kit Package Installation

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### @dnd-kit Components to Use

**From `@dnd-kit/core`:**
- `DndContext` - Main drag-n-drop context provider
- `PointerSensor` - Mouse/touch input sensor
- `KeyboardSensor` - Keyboard navigation support
- `useSensors` - Configure sensors
- `useSensor` - Create individual sensors

**From `@dnd-kit/sortable`:**
- `SortableContext` - Context for sortable lists
- `useSortable` - Hook for sortable items
- `arrayMove` - Utility to reorder arrays
- `verticalListSortingStrategy` - Sorting strategy for vertical lists

**From `@dnd-kit/utilities`:**
- `CSS` - CSS utilities for drag animations

### Integration with Ant Design

**DndContext Setup:**
```typescript
const sensors = useSensors(
  useSensor(PointerSensor),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);

<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext
    items={bootOrder}
    strategy={verticalListSortingStrategy}
  >
    {/* BootOrderItem components */}
  </SortableContext>
</DndContext>
```

**BootOrderItem with Ant Design:**
```typescript
const {
  attributes,
  listeners,
  setNodeRef,
  transform,
  transition,
  isDragging,
} = useSortable({ id: props.id });

const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: isDragging ? 0.5 : 1,
};

return (
  <div ref={setNodeRef} style={style}>
    <Flex align="center" gap={8}>
      <div {...attributes} {...listeners}>
        <HolderOutlined style={{ cursor: 'grab' }} />
      </div>
      <Text>{props.name}</Text>
    </Flex>
  </div>
);
```

### Drag End Handler

```typescript
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;

  if (over && active.id !== over.id) {
    const oldIndex = bootOrder.indexOf(active.id as string);
    const newIndex = bootOrder.indexOf(over.id as string);

    const newBootOrder = arrayMove(bootOrder, oldIndex, newIndex);
    form.setFieldValue('bootOrder', newBootOrder);
  }
};
```

### Visual Feedback

- **Dragging state:** Reduce opacity to 0.5
- **Drag handle:** Use `HolderOutlined` icon from @ant-design/icons
- **Cursor:** `grab` for drag handle, `grabbing` during drag
- **Transition:** Smooth CSS transitions for position changes

## 6. Integration Steps

### Step 1: Install Dependencies

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Step 2: Update Type Definitions

Edit `src/pages/CreateVm/types.ts`:
- Add `bootOrder: string[]` to `CreateVmFormValues` interface

### Step 3: Update Initial Values

Edit `src/pages/CreateVm/index.tsx`:
- Add `bootOrder: []` to `initialValues`

### Step 4: Create BootOrder Directory

```bash
mkdir src/pages/CreateVm/BootOrder
```

### Step 5: Create BootOrderItem Component

Create `src/pages/CreateVm/BootOrder/BootOrderItem.tsx`:
- Implement sortable item with drag handle
- Use Ant Design components (Flex, Typography, icons)

### Step 6: Create Main BootOrder Component

Create `src/pages/CreateVm/BootOrder/index.tsx`:
- Implement synchronization logic
- Set up @dnd-kit context
- Render list of BootOrderItem components

### Step 7: Export BootOrder Component

Create `src/pages/CreateVm/BootOrder/index.tsx`:
- Use named export: `export const BootOrder: React.FC = () => { ... }`

### Step 8: Import and Use in Main Form

Edit `src/pages/CreateVm/index.tsx`:
- Import BootOrder component
- Add `<BootOrder />` after `<HddDisks />`

### Step 9: Verify TypeScript

```bash
npm run ts
```

### Step 10: Lint and Format

```bash
npm run lint
```

## 7. Testing Considerations

### Functional Tests

1. **Initial State**
   - Boot order list is empty when no disks exist
   - Boot order list shows all disks when disks are added

2. **Disk Addition**
   - New disk appears at end of boot order list
   - Disk name matches the name in HddDisks section

3. **Disk Deletion**
   - Deleted disk is removed from boot order list
   - Remaining disks maintain their order

4. **Disk Renaming**
   - Renamed disk shows new name in boot order list
   - Disk position in boot order is preserved

5. **Drag-n-Drop Reordering**
   - Disks can be reordered by dragging
   - New order is persisted in form state
   - Visual feedback during drag (opacity, cursor)

6. **Keyboard Navigation**
   - Disks can be reordered using keyboard
   - Tab navigation works correctly
   - Screen reader announces drag operations

7. **Form Submission**
   - Boot order is included in form values
   - Boot order array contains correct disk IDs

8. **Form Reset**
   - Boot order resets to empty array
   - List clears correctly

### Edge Case Tests

1. **Empty hddDisks**
   - Boot order list is empty
   - No errors thrown

2. **Single Disk**
   - Single disk displays correctly
   - Drag handle is visible but reordering has no effect

3. **Many Disks**
   - List scrolls correctly with many disks
   - Performance remains acceptable

4. **Rapid Changes**
   - Adding/deleting disks rapidly doesn't cause errors
   - Synchronization handles concurrent updates

5. **Invalid Boot Order**
   - Boot order with non-existent disk IDs is cleaned up
   - Duplicate IDs are handled

### Visual Tests

1. **Layout**
   - Card title displays correctly: "Порядок загрузки"
   - List is vertical with proper spacing
   - Drag handles are aligned

2. **Drag Feedback**
   - Dragged item has reduced opacity
   - Cursor changes to 'grabbing'
   - Other items shift to make room

3. **Responsive Design**
   - List displays correctly on different screen sizes
   - Drag handles remain accessible on mobile

### Integration Tests

1. **HddDisks Integration**
   - Changes in HddDisks section reflect in Boot Order
   - Both sections stay synchronized

2. **Form Validation**
   - Boot order doesn't interfere with other form validation
   - Form can be submitted with valid boot order

3. **Form State**
   - Boot order persists across re-renders
   - Boot order updates don't trigger unnecessary re-renders

## 8. Code Examples

### Complete BootOrder Component

```typescript
import React, { useEffect } from 'react';
import { Card, Typography, Flex, Empty } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { HddDisk } from '../types';

const { Text } = Typography;

interface BootOrderItemProps {
  id: string;
  name: string;
}

const BootOrderItem: React.FC<BootOrderItemProps> = ({ id, name }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Flex
        align="center"
        gap={8}
        style={{
          padding: '8px 12px',
          background: '#fafafa',
          borderRadius: '4px',
          border: '1px solid #f0f0f0',
        }}
      >
        <div {...attributes} {...listeners} style={{ cursor: 'grab' }}>
          <HolderOutlined />
        </div>
        <Text>{name}</Text>
      </Flex>
    </div>
  );
};

export const BootOrder: React.FC = () => {
  const form = Form.useFormInstance();
  const hddDisks = Form.useWatch('hddDisks', form) as HddDisk[];
  const bootOrder = Form.useWatch('bootOrder', form) as string[];

  // Synchronize bootOrder with hddDisks
  useEffect(() => {
    const disks = hddDisks || [];
    const currentBootOrder = bootOrder || [];

    // Remove disks that no longer exist
    const validBootOrder = currentBootOrder.filter(id =>
      disks.some(disk => disk.id === id)
    );

    // Add new disks to end
    const newDiskIds = disks
      .filter(disk => !currentBootOrder.includes(disk.id))
      .map(disk => disk.id);

    const updatedBootOrder = [...validBootOrder, ...newDiskIds];

    // Update if changed
    if (JSON.stringify(updatedBootOrder) !== JSON.stringify(currentBootOrder)) {
      form.setFieldValue('bootOrder', updatedBootOrder);
    }
  }, [hddDisks, bootOrder, form]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = bootOrder.indexOf(active.id as string);
      const newIndex = bootOrder.indexOf(over.id as string);

      const newBootOrder = arrayMove(bootOrder, oldIndex, newIndex);
      form.setFieldValue('bootOrder', newBootOrder);
    }
  };

  const diskMap = new Map((hddDisks || []).map(disk => [disk.id, disk.name]));

  return (
    <Card title="Порядок загрузки">
      {bootOrder && bootOrder.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={bootOrder}
            strategy={verticalListSortingStrategy}
          >
            <Flex vertical gap={8}>
              {bootOrder.map(id => (
                <BootOrderItem
                  key={id}
                  id={id}
                  name={diskMap.get(id) || id}
                />
              ))}
            </Flex>
          </SortableContext>
        </DndContext>
      ) : (
        <Empty
          description="Нет доступных дисков"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
};
```

### Updated Main Form Integration

```typescript
import {Button, Layout, Typography, Form, Space} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import type {CreateVmFormValues} from './types';
import MainInfo from './MainInfo';
import HddDisks from './HddDisks';
import {BootOrder} from './BootOrder'; // Add this import

const {Header, Content} = Layout;
const {Title} = Typography;

export const CreateVmPage = () => {
  const [form] = Form.useForm<CreateVmFormValues>();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(values => {
        console.log('Form values:', values);
      })
      .catch(error => {
        console.log('Validation failed:', error);
      });
  };

  const handleCancel = () => {
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
          <Button
            type="text"
            onClick={handleCancel}
            icon={<ArrowLeftOutlined />}
          ></Button>
          <Title level={2} style={{margin: 0, fontSize: '20px'}}>
            Создание ВМ
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
            description: '',
            cpuCount: 1,
            ramSize: 4,
            chipset: 'q35',
            hddDisks: [],
            bootOrder: [], // Add this line
          }}
        >
          <MainInfo />
          <HddDisks />
          <BootOrder /> {/* Add this line */}

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
```

## 9. Summary

This implementation plan provides a complete roadmap for adding the Boot Order section to the VM creation form. The key aspects are:

1. **Type Safety**: Proper TypeScript types for boot order
2. **Synchronization**: Automatic sync between HddDisks and BootOrder
3. **Drag-n-Drop**: Modern, accessible drag-n-drop using @dnd-kit
4. **Integration**: Seamless integration with existing form structure
5. **Testing**: Comprehensive test coverage for all scenarios

The implementation follows existing patterns in the codebase (Form.useFormInstance, Form.useWatch, useEffect) and uses Ant Design components consistently.
