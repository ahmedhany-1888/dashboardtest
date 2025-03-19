// components/NavItem.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ListItem, ListItemText, TextField, Switch, Box } from '@mui/material';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { Identifier } from 'dnd-core';
import { NavItemType } from './SideNav';

const ItemType = "NAV_ITEM";

interface DragItem {
  index: number;
  id: number;
  type: string;
}

interface NavItemProps {
  index: number;
  item: NavItemType;
  editMode: boolean;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onChange: (updatedItem: NavItemType) => void;
}

const NavItem: React.FC<NavItemProps> = ({ index, item, editMode, moveItem, onChange }) => {
  const [title, setTitle] = useState(item.title);
  const [visible, setVisible] = useState(item.visible !== false);

  useEffect(() => {
    onChange({ ...item, title, visible });
  }, [title, visible]);

  const ref = useRef<HTMLDivElement>(null);

  // Set up the drop target
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: ItemType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(draggedItem: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) return;

      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the item's height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      // Perform the move
      moveItem(dragIndex, hoverIndex);
      // Update the dragged item's index for performance
      draggedItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: () => ({ id: item.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <ListItem
    component="div" // Specify a div so that ref types match
    ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} data-handler-id={handlerId}>
      {editMode ? (
        <Box display="flex" alignItems="center" width="100%">
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1, mr: 1 }}
          />
          <Switch
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            inputProps={{ "aria-label": "toggle visibility" }}
          />
        </Box>
      ) : (
        <ListItemText primary={item.title} />
      )}
    </ListItem>
  );
};

export default NavItem;
