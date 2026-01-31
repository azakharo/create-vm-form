import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {DragOutlined} from '@ant-design/icons';
import {Flex} from 'antd';

interface BootOrderItemProps {
  id: string;
  name: string;
}

export const BootOrderItem: React.FC<BootOrderItemProps> = ({id, name}) => {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
    useSortable({id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="boot-order-item"
    >
      <Flex
        align="center"
        gap={12}
        style={{
          padding: '12px 16px',
          backgroundColor: '#fff',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          marginBottom: '8px',
        }}
      >
        <DragOutlined style={{color: '#8c8c8c', cursor: 'grab'}} />
        <span style={{fontSize: '14px', color: '#262626'}}>{name}</span>
      </Flex>
    </div>
  );
};
