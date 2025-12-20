import styled from "@emotion/styled";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

const AffItem = ({ aff, color }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: aff });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : undefined,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <ListItem
      fg={color?.fg || "white"}
      bg={color?.bg}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {aff.capitalize()}
    </ListItem>
  );
};

export const AffItemOverlay = ({ aff, color }) => {
  return (
    <ListItem
      fg={color?.fg || "white"}
      bg={color?.bg}
      style={{ cursor: "grabbing" }}
    >
      {aff.capitalize()}
    </ListItem>
  );
};

export default AffItem;
