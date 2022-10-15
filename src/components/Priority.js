import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import { SortableItem } from './SortableItem';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

export function Priority(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  });

  const style = {
    color: isOver ? 'green' : undefined,
    background: "grey",
    padding: 10,
    margin: 10,
    width: 500,
    height: 'auto',
    minHeight: 50,
    display: "flex",
    flexDirection: "row",
    flexWrap: 'wrap'
  };
  
  
  return (
    <SortableContext
      id={props.id}
      items={props.items}
      strategy={rectSortingStrategy}
      
    >
    <div ref={setNodeRef} style={style}>
      {props.items.map((id) => (
          <SortableItem key={id} id={id} />
        ))}
    </div>
    </SortableContext>
  );
}