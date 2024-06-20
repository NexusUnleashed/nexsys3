import { DragDropContext } from "react-beautiful-dnd";
import { useState, useEffect, useCallback } from "react";
import AffColumn from "./AffColumn";

const createColumn = ({ id, affs }) => {
  return {
    id: `prio-${id}`,
    prio: id,
    title: `Prio ${id}`,
    //affs: Object.keys(affs).filter((aff) => affs[aff].prio === id),
    affs: affs || [],
  };
};

const createColumns = (affs) => {
  const columns = {};
  for (let i = 1; i < 27; i++) {
    columns[`prio-${i}`] = createColumn({ id: i, affs: affs[i] });
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

const AffPriorities = ({ colors, affTable, setAffTable, setPrioArrays }) => {
  const [columns, setColumns] = useState({
    ...createColumns(affTable.prioArrays),
  });
  const [prios, setPrios] = useState({ ...affTable.prios });
  const [columnOrder, setColumnOrder] = useState([...createColumnOrder()]);

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
    const newPrios = { ...prios };
    newPrios[draggableId] = columns[destination.droppableId].prio;
    setPrios({ ...newPrios });
  };

  useEffect(() => {
    setAffTable((prev) => ({
      ...prev,
      prios: { ...prios },
    }));
    columnOrder.forEach((col) => {
      setPrioArrays(columns[col].prio, columns[col].affs);
    });
    console.log(prios);
  }, [prios]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          height: "auto",
          width: "auto",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {columnOrder.map((col) => (
          <AffColumn key={col} column={columns[col]} colors={colors} />
        ))}
      </div>
    </DragDropContext>
  );
};

export default AffPriorities;
/*
'{"_name":"asthma","_status":false,"_got_time":0,"_lost_time":0,"_prio":{"_name":"asthma","_default":6,"_current":6,"_prev":6},"_cures":["aurum","kelp","tree","fitness","bloodboil","dragonheal","salt","siphon","shrugging","slough","fool","alleviate"],"_serverside":true,"_uncurable":false}'
*/
