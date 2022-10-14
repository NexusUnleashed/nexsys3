import * as React from "react";
import styled from "@emotion/styled";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const AffItem = ({ aff, index }) => {
  return (
    <Draggable key={aff} draggableId={aff} index={index}>
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
          {aff}
        </div>
      )}
    </Draggable>
  );
};

const AffList = React.memo(function AffList({ affs }) {
  return affs.map((aff, index) => (
    <AffItem aff={aff} index={index} key={aff} />
  ));
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  display: "flex",
  "flex-wrap": "wrap",
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

const droppableIdMap = ["one", "two", "three", "four", "five", "six"];

const PriorityList = ({ affs }) => {
  const [state, setState] = React.useState({ affs });

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!result.destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        state.affs[droppableIdMap.indexOf(source.droppableId)],
        source.index,
        destination.index
      );

      state.affs[droppableIdMap.indexOf(source.droppableId)] = items;

      setState(state);
    } else {
      const result = move(
        state.affs[droppableIdMap.indexOf(source.droppableId)],
        state.affs[droppableIdMap.indexOf(destination.droppableId)],
        source,
        destination
      );
      Object.keys(result).forEach((key) => {
        state.affs[droppableIdMap.indexOf(key)] = result[key];
      });
      setState(state);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {droppableIdMap.map((id) => {
        console.log(id)
        return (
          <Droppable droppableId={id} direction="horizontal">
            {(provided, snapshot) => (
              <div>
                {id}
              <div
                style={getListStyle(snapshot.isDraggingOver)}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {id}
                <AffList affs={state.affs[droppableIdMap.indexOf(id)] ?? []} />
                {provided.placeholder}
              </div>
              </div>
            )}
          </Droppable>
        );
      })}
    </DragDropContext>
  );
};

export default PriorityList;
