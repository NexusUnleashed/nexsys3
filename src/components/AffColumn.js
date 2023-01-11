import styled from "@emotion/styled";
import { Droppable } from "react-beautiful-dnd";
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
    return (
        <Container>
            <Title>{column.title}</Title>
            <Droppable droppableId={column.id}>
                {(provided) => (
                    <AffList ref={provided.innerRef} {...provided.droppableProps}>
                        {column.affs.map((aff, i) => (
                            <AffItem key={aff} aff={aff} index={i} color={colors[aff]} />
                        ))}
                        {provided.placeholder}
                    </AffList>
                )}
            </Droppable>
        </Container>
    );
};

export default AffColumn;