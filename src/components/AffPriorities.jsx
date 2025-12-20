import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState, useEffect, useRef } from "react";
import AffColumn from "./AffColumn";
import { AffItemOverlay } from "./AffItem";

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

const findContainer = (id, columnState) => {
  if (columnState[id]) {
    return id;
  }
  return Object.keys(columnState).find((key) =>
    columnState[key].affs.includes(id)
  );
};

const AffPriorities = ({ colors, affTable, setAffTable, setPrioArrays }) => {
  const [columns, setColumns] = useState({
    ...createColumns(affTable.prioArrays),
  });
  const [prios, setPrios] = useState({ ...affTable.prios });
  const [columnOrder] = useState([...createColumnOrder()]);
  const [activeId, setActiveId] = useState(null);
  const activeContainerRef = useRef(null);
  const clonedColumnsRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = ({ active }) => {
    setActiveId(active.id);
    activeContainerRef.current = findContainer(active.id, columns);
    clonedColumnsRef.current = columns;
  };

  const onDragCancel = () => {
    if (clonedColumnsRef.current) {
      setColumns(clonedColumnsRef.current);
    }
    setActiveId(null);
    activeContainerRef.current = null;
    clonedColumnsRef.current = null;
  };

  const onDragOver = ({ active, over }) => {
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    setColumns((prevColumns) => {
      const activeContainer = findContainer(activeId, prevColumns);
      const overContainer = findContainer(overId, prevColumns);

      if (!activeContainer || !overContainer) {
        return prevColumns;
      }

      if (activeContainer === overContainer) {
        return prevColumns;
      }

      const sourceItems = prevColumns[activeContainer].affs;
      const destItems = prevColumns[overContainer].affs;
      const activeIndex = sourceItems.indexOf(activeId);

      if (activeIndex === -1) {
        return prevColumns;
      }

      const overIndex = destItems.indexOf(overId);
      const translated = active.rect.current?.translated;
      const isBelowOverItem =
        overIndex !== -1 &&
        translated &&
        translated.top > over.rect.top + over.rect.height;
      const insertIndex =
        overIndex === -1
          ? destItems.length
          : overIndex + (isBelowOverItem ? 1 : 0);

      return {
        ...prevColumns,
        [activeContainer]: {
          ...prevColumns[activeContainer],
          affs: sourceItems.filter((item) => item !== activeId),
        },
        [overContainer]: {
          ...prevColumns[overContainer],
          affs: [
            ...destItems.slice(0, insertIndex),
            activeId,
            ...destItems.slice(insertIndex),
          ],
        },
      };
    });
  };

  const onDragEnd = ({ active, over }) => {
    if (!over) {
      onDragCancel();
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    setColumns((prevColumns) => {
      const activeContainer = findContainer(activeId, prevColumns);
      const overContainer = findContainer(overId, prevColumns);

      if (!activeContainer || !overContainer) {
        return prevColumns;
      }

      if (activeContainer === overContainer) {
        const items = prevColumns[activeContainer].affs;
        const activeIndex = items.indexOf(activeId);
        const overIndex = items.indexOf(overId);
        const targetIndex = overIndex === -1 ? items.length - 1 : overIndex;

        if (activeIndex === -1 || activeIndex === targetIndex) {
          return prevColumns;
        }

        return {
          ...prevColumns,
          [activeContainer]: {
            ...prevColumns[activeContainer],
            affs: arrayMove(items, activeIndex, targetIndex),
          },
        };
      }

      const sourceItems = prevColumns[activeContainer].affs;
      const destItems = prevColumns[overContainer].affs;
      const activeIndex = sourceItems.indexOf(activeId);

      if (activeIndex === -1) {
        return prevColumns;
      }

      const overIndex = destItems.indexOf(overId);
      const translated = active.rect.current?.translated;
      const isBelowOverItem =
        overIndex !== -1 &&
        translated &&
        translated.top > over.rect.top + over.rect.height;
      const insertIndex =
        overIndex === -1
          ? destItems.length
          : overIndex + (isBelowOverItem ? 1 : 0);

      return {
        ...prevColumns,
        [activeContainer]: {
          ...prevColumns[activeContainer],
          affs: sourceItems.filter((item) => item !== activeId),
        },
        [overContainer]: {
          ...prevColumns[overContainer],
          affs: [
            ...destItems.slice(0, insertIndex),
            activeId,
            ...destItems.slice(insertIndex),
          ],
        },
      };
    });

    const originContainer = activeContainerRef.current;
    const overContainer = findContainer(overId, columns);
    if (originContainer && overContainer && originContainer !== overContainer) {
      const nextPrio = columns[overContainer]?.prio;
      setPrios((prev) => ({
        ...prev,
        [activeId]: nextPrio,
      }));
    }

    setActiveId(null);
    activeContainerRef.current = null;
    clonedColumnsRef.current = null;
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragCancel={onDragCancel}
      onDragEnd={onDragEnd}
    >
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
      <DragOverlay>
        {activeId ? (
          <AffItemOverlay
            aff={activeId}
            color={colors[activeId.replace(/\d+$/, "")]}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default AffPriorities;
/*
'{"_name":"asthma","_status":false,"_got_time":0,"_lost_time":0,"_prio":{"_name":"asthma","_default":6,"_current":6,"_prev":6},"_cures":["aurum","kelp","tree","fitness","bloodboil","dragonheal","salt","siphon","shrugging","slough","fool","alleviate"],"_serverside":true,"_uncurable":false}'
*/
