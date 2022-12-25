import styled from "@emotion/styled";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import * as React from "react";

const createColumn = ({ id, affs }) => {
  return {
    id: `prio-${id}`,
    prio: id,
    title: `Prio ${id}`,
    affs: Object.keys(affs).filter((aff) => affs[aff].prio === id),
  };
};

const createColumns = (affs) => {
  const columns = {};
  for (let i = 1; i < 27; i++) {
    columns[`prio-${i}`] = createColumn({ id: i, affs: affs });
  }

  return columns;
};

const createColumnOrder = () => {
  const columnOrder = [];
  for (let i = 1; i < 27; i++) {
    columnOrder.push(`prio-${i}`);
  }
  return columnOrder;
};

const Container = styled.div`
  min-width: 100px;
  flex-grow: 0;
  flex-shrink: 0;
  margin: 0px;
  border: 1px solid lightgrey;
  border-radius: 2px;
`;
const ListItem = styled.div`
width: auto;
padding: 3px 10px 3px 10px;
font-size: 13px;
margin: 0px;
border: 1px solid lightgrey;
border-radius: 2px;
background: #121212;
${props => `color:${props.fg}`};
${props => `background:${props.bg}`};
`;
const Title = styled.h3`
  text-align: center;
  padding: 5px;
  width: auto;
  
`;
const AffList = styled.div`
  padding: 8px;
`;

const AffItem = ({ aff, index, color }) => {
  return (
    <Draggable draggableId={aff.name} index={index}>
      {(provided) => (
        <ListItem
          fg = {color?.fg}
          bg = {color?.bg}
          ref = {provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {aff.name.capitalize()}
        </ListItem>
      )}
    </Draggable>
  );
};

const Column = ({ column, affs, colors }) => {
  return (
    <Container>
      <Title>{column.title}</Title>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <AffList ref={provided.innerRef} {...provided.droppableProps}>
            {column.affs.map((aff, i) => (
              <AffItem key={aff} aff={affs[aff]} index={i} color={colors[aff]} />
            ))}
            {provided.placeholder}
          </AffList>
        )}
      </Droppable>
    </Container>
  );
};

const AffPriorities = ({ colors, affs, affPrios }) => {
  const [columns, setColumns] = React.useState({ ...createColumns(affs) });
  const [prios, setPrios] = React.useState({...affPrios});
  const [columnOrder, setColumnOrder] = React.useState([
    ...createColumnOrder(),
  ]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    
    //If there is no destination, the user dropped the item outside of the context
    if (!destination) {
      return;
    }
    
    //Was the item moved to the same location?
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If the item was dropped into the same priority, in a new order.
    // TODO: do we care about the order? We should update all items in
    // a column; I don't remember if that impacts serverside selection or not.
    if (destination.droppableId === source.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const sourceAffs = [...sourceColumn.affs];
      sourceAffs.splice(source.index, 1);
      sourceAffs.splice(destination.index, 0, draggableId);

      const newSourceColumn = { ...sourceColumn, affs: sourceAffs };
      setColumns({
        ...columns,
        [newSourceColumn.id]: newSourceColumn,
      });
    } else {
      const sourceColumn = columns[source.droppableId];
      const targetColumn = columns[destination.droppableId];
      const sourceAffs = [...sourceColumn.affs];
      const targetAffs = [...targetColumn.affs];
      sourceAffs.splice(source.index, 1);
      targetAffs.splice(destination.index, 0, draggableId);

      const newSourceColumn = { ...sourceColumn, affs: sourceAffs };
      const newTargetColumn = { ...targetColumn, affs: targetAffs };
      setColumns({
        ...columns,
        [newSourceColumn.id]: newSourceColumn,
        [newTargetColumn.id]: newTargetColumn,
      });
    }

    //update prios based on the location of the moved affliction.
    const newPrios = {...prios};
    newPrios[draggableId] = columns[destination.droppableId].prio;
    setPrios({...newPrios});
  };

  React.useEffect(()=>{
    globalThis.nexSys.affTable.prios = {...prios};
  }, [prios]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{display: 'flex', flexDirection: 'row'}}>
      {columnOrder.map((col) => (
        <Column key={col} column={columns[col]} affs={affs} colors={colors} />
      ))}
      </div>
    </DragDropContext>
  );
};

export default AffPriorities;
/*
'{"_name":"asthma","_status":false,"_got_time":0,"_lost_time":0,"_prio":{"_name":"asthma","_default":6,"_current":6,"_prev":6},"_cures":["aurum","kelp","tree","fitness","bloodboil","dragonheal","salt","siphon","shrugging","slough","fool","alleviate"],"_serverside":true,"_uncurable":false}'
*/
