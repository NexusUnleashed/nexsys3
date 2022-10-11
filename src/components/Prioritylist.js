import * as React from "react";
import styled from "@emotion/styled";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const AffItem = ({aff, index}) => {
    return (
        <Draggable draggableId={aff.id} index={index}>
            {provided => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps} 
                    index={index}
                >
                    {aff.id}
                </div>
            )}
        </Draggable>
    );
}

const AffList = React.memo(function AffList({affs}) {
    return affs.map((aff, index) => (
        <AffItem aff={aff} index={index} key={aff.id}/>
    ))
})

const reorder = (list, startIndex, endIndex) => {
    console.log(list)
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };

const PriorityList = ({affs}) => {
    const [state, setState] = React.useState({affs})
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
          }
      
          if (result.destination.index === result.source.index) {
            return;
          }

          console.log(state.affs)
          const quotes = reorder(
            state.affs,
            result.source.index,
            result.destination.index
          );
          console.log(quotes)
      
          setState({ quotes });
    }
    
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {
            provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                    <AffList affs={state.affs}/>
                    {provided.placeholder}
                </div>
          )}
      </Droppable>
    </DragDropContext>
        
    );
}

export default PriorityList;