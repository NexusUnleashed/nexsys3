import styled from "@emotion/styled";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import * as React from "react";
import AffItem from "./AffItem";

const AffList = styled.div`
  padding: 8px;
`;
const Title = styled.h3`
  text-align: center;
  padding: 5px;
  width: auto;
  margin: 4px;
  color: white;
`;
const Container = styled.div`
  min-width: 100px;
  flex-grow: 0;
  flex-shrink: 0;
  margin: 0px;
  border: 1px solid lightgrey;
  border-radius: 0px;
`;

const AffColumn = ({ column, colors }) => {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <Container>
      <Title>{column.title}</Title>
      <AffList ref={setNodeRef}>
        <SortableContext
          items={column.affs}
          strategy={verticalListSortingStrategy}
        >
          {column.affs.map((aff) => (
            <AffItem
              key={aff}
              aff={aff}
              color={colors[aff.replace(/\d+$/, "")]}
            />
          ))}
        </SortableContext>
      </AffList>
    </Container>
  );
};

export default AffColumn;
