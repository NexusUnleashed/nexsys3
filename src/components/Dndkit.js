import React, {useState} from 'react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  rectSortingStrategy
} from '@dnd-kit/sortable';

import {SortableItem} from './SortableItem';
import { Droppable } from './Droppable';

function Dndkit() {
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const containerStyle = {
    background: "red",
    padding: 10,
    margin: 10,
    width: 200,
    height: 300,
    flex: 1,
    flexDirection: "row",
    display: "flex",
    'flex-wrap': 'wrap'
  };
  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={items}
        strategy={rectSortingStrategy}
      >
        <Droppable id={"one"}>
        <div style={containerStyle}>
                  {items.map(id => <SortableItem key={id} id={id} />)}
                  </div>
                  </Droppable>
      </SortableContext>

      <SortableContext 
      items={[]}
        strategy={rectSortingStrategy}
      >
        <Droppable id={'two'}>
        <div style={containerStyle}>

                  </div>
                  </Droppable>
      </SortableContext>

    </DndContext>
  );
  
  function handleDragEnd(event) {
    const {active, over} = event;
    
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}

export default Dndkit;