import styled from "@emotion/styled";
import { Draggable } from "react-beautiful-dnd";
import * as React from "react";

const ListItem = styled.div`
  width: auto;
  padding: 3px 10px 3px 10px;
  font-size: 13px;
  margin: 0px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  background: #121212;
  ${(props) => `color:${props.fg}`};
  ${(props) => `background:${props.bg}`};
`;

const AffItem = ({ aff, index, color }) => {
  return (
    <Draggable draggableId={aff} index={index}>
      {(provided) => (
        <ListItem
          fg={color?.fg || "white"}
          bg={color?.bg}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {aff.capitalize()}
        </ListItem>
      )}
    </Draggable>
  );
};

export default AffItem;
