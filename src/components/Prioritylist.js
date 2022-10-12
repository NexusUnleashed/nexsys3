import * as React from "react";
import styled from "@emotion/styled";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const AffItem = ({ aff, index }) => {
  return (
    <Draggable key={aff.id} draggableId={aff.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          {aff.id}
        </div>
      )}
    </Draggable>
  );
};

const AffList = React.memo(function AffList({ affs }) {
  return affs.map((aff, index) => (
    <AffItem aff={aff} index={index} key={aff.id} />
  ));
});

const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = [...source];
  const destClone = [...destination];
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  display: "flex",
  padding: 16,
  overflow: "auto",
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 8 * 2,
  margin: `0 ${8}px 0 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const PriorityList = ({ affs }) => {
  const [state, setState] = React.useState({ affs });
  
  const onDragEnd = (result) => {
    const {source, destination} = result;
    if (!result.destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        affs[source.droppableId],
        source.index,
        destination.index
      );

      let state = { items };

      if (source.droppableId === "droppable2") {
        state = { selected: items };
      }

      this.setState(state);
    } else {
      const result = move(
        affs[source.droppableId],
        affs[destination.droppableId],
        source,
        destination
      );

      setState({
        items: result.droppable,
        selected: result.droppable2,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="one" direction="horizontal">
        {(provided, snapshot) => (
          <div
            style={getListStyle(snapshot.isDraggingOver)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <AffList affs={state.affs[0]} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="two" direction="horizontal">
        {(provided, snapshot) => (
          <div
            style={getListStyle(snapshot.isDraggingOver)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <AffList affs={state.affs[1]} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default PriorityList;
