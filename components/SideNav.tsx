"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  IconButton,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CreateIcon from "@mui/icons-material/Create";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronTopIcon from "@mui/icons-material/ExpandLess";

// === react-dnd imports
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Identifier } from "dnd-core";

// Data structure for nav items
export interface NavItemType {
  id: number;
  title: string;
  target: string;
  visible?: boolean;
  children?: NavItemType[];
}

// Drag item type constant
const NAV_ITEM_TYPE = "NAV_ITEM";

function reorder<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...list];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}


function reorderNavItems(
  items: NavItemType[],
  parentId: number | null,
  fromIndex: number,
  toIndex: number
): NavItemType[] {
  // If parentId is null, reorder top-level
  if (parentId === null) {
    return reorder(items, fromIndex, toIndex);
  }
  // Otherwise, find the parent and reorder in its .children
  return items.map((item) => {
    if (item.id === parentId && item.children) {
      const newChildren = reorder(item.children, fromIndex, toIndex);
      return { ...item, children: newChildren };
    }
    // Recurse deeper if needed
    if (item.children && item.children.length > 0) {
      return {
        ...item,
        children: reorderNavItems(item.children, parentId, fromIndex, toIndex),
      };
    }
    return item;
  });
}

// Data passed around during dragging
interface DragItem {
  type: string; 
  id: number;
  parentId: number | null; // The parent under which this item currently is
  index: number; // The position in parent's array
}

export default function SideNav() {
  const [navItems, setNavItems] = useState<NavItemType[]>([]);
  const [editMode, setEditMode] = useState(false);

  // Track which items are expanded in view mode
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  useEffect(() => {
    // Fetch or load nav items from server
    fetch("http://localhost:8081/nav")
      .then((res) => res.json())
      .then((data) => setNavItems(data))
      .catch((err) => console.error("Error fetching nav:", err));
  }, []);

  // === Edit Mode Handlers ===
  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleDiscardChanges = () => {
    // Re-fetch or revert to original nav items
    fetch("http://localhost:8081/nav")
      .then((res) => res.json())
      .then((data) => setNavItems(data))
      .catch((err) => console.error("Error fetching nav:", err));
    setEditMode(false);
  };

  const handleSaveChanges = () => {
    // Save navItems to server
    fetch("http://localhost:8081/nav", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(navItems),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save changes");
        setEditMode(false);
      })
      .catch((err) => console.error("Error saving nav:", err));
  };

  // === Visibility / Rename Handlers (used in edit mode) ===
  const handleToggleVisibility = (itemId: number, visible: boolean) => {
    setNavItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, visible }
          : {
              ...item,
              children: item.children?.map((child) =>
                child.id === itemId ? { ...child, visible } : child
              ),
            }
      )
    );
  };

  const handleRename = (itemId: number) => {
    const newTitle = prompt("Enter new title:");
    if (!newTitle) return;

    setNavItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, title: newTitle }
          : {
              ...item,
              children: item.children?.map((child) =>
                child.id === itemId ? { ...child, title: newTitle } : child
              ),
            }
      )
    );
  };

  // === Expand/Collapse Logic for View Mode ===
  const handleToggleExpand = (itemId: number) => {
    setExpandedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isTopLevelItem = (item: NavItemType) =>
    !navItems.some((nav) => nav.children?.includes(item));

  // === Move item among siblings
  const moveItem = (parentId: number | null, fromIndex: number, toIndex: number) => {
    setNavItems((prev) => {
      const newItems = reorderNavItems(prev, parentId, fromIndex, toIndex);

      return newItems;
    });
  };

  const renderViewModeItem = (item: NavItemType): JSX.Element | null => {
    if (item.visible === false) return null;

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedIds.includes(item.id);
    const topLevel = isTopLevelItem(item);
    const backgroundColor = topLevel ? "#F5F5F5" : "transparent";

    return (
      <Box key={item.id}>
        {/* Item row */}
        <Box
          sx={{
            backgroundColor,
            borderRadius: 1,
            my: 0.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: hasChildren ? "pointer" : "default",
              px: 1,
            }}
            onClick={() => hasChildren && handleToggleExpand(item.id)}
          >
            <ListItemText primary={item.title} />
            {hasChildren &&
              (isExpanded ? (
                <ChevronTopIcon sx={{ color: "#666" }} />
              ) : (
                <ExpandMoreIcon sx={{ color: "#666" }} />
              ))}
          </Box>
        </Box>

        {hasChildren && isExpanded && (
          <Box sx={{ ml: 2 }}>
            {item.children?.map((child) => renderViewModeItem(child))}
          </Box>
        )}
      </Box>
    );
  };

  const renderEditModeTree = (items: NavItemType[], parentId: number | null) => {
    return items.map((item, index) => (
      <EditNavItem
        key={item.id}
        item={item}
        index={index}
        parentId={parentId}
        moveItem={moveItem}
        handleRename={handleRename}
        handleToggleVisibility={handleToggleVisibility}
        isTopLevel={isTopLevelItem(item) && parentId === null}
      >
        {/* If children exist, render them indented */}
        {item.children && item.children.length > 0 && (
          <Box sx={{ ml: 3 }}>
            {renderEditModeTree(item.children, item.id)}
          </Box>
        )}
      </EditNavItem>
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ width: 280, p: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Menu
          </Typography>
          {!editMode ? (
            <IconButton onClick={handleToggleEditMode}>
              <SettingsIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Discard (X) with red circle */}
              <IconButton
                onClick={handleDiscardChanges}
                sx={{
                  color: "#D50000", 
                  border: "2px solid #D50000", 
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 1,
                }}
              >
                <CloseIcon />
              </IconButton>
              {/* Save (check) with green circle */}
              <IconButton
                onClick={handleSaveChanges}
                sx={{
                  color: "#48A74C", 
                  border: "2px solid #48A74C", 
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Divider after "Menu" */}
        <Divider sx={{ mb: 2 }} />

        {/* Nav items (either in view mode or edit mode) */}
        {!editMode ? (
          <Box>
            {navItems.map((item) => renderViewModeItem(item))}
          </Box>
        ) : (
          <Box>{renderEditModeTree(navItems, null)}</Box>
        )}
      </Box>
    </DndProvider>
  );
}

interface EditNavItemProps {
  item: NavItemType;
  index: number;
  parentId: number | null;
  moveItem: (parentId: number | null, fromIndex: number, toIndex: number) => void;
  handleRename: (itemId: number) => void;
  handleToggleVisibility: (itemId: number, visible: boolean) => void;
  isTopLevel: boolean;
  children?: React.ReactNode;
}

function EditNavItem({
  item,
  index,
  parentId,
  moveItem,
  handleRename,
  handleToggleVisibility,
  isTopLevel,
  children,
}: EditNavItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const opacity = item.visible === false ? 0.5 : 1;
  const backgroundColor = isTopLevel ? "#F5F5F5" : "transparent";

  const [{ 
    // isDragging 
  }, drag] = useDrag({
    type: NAV_ITEM_TYPE,
    item: () => ({
      type: NAV_ITEM_TYPE,
      id: item.id,
      parentId,
      index,
    }),
    collect: () => ({
      // isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: NAV_ITEM_TYPE,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover(dragItem, monitor) {
      if (!ref.current) return;
      const dragIndex = dragItem.index;
      const hoverIndex = index;

      if (dragItem.parentId !== parentId) return;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveItem(parentId, dragIndex, hoverIndex);

      dragItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <Box ref={ref} data-handler-id={handlerId} sx={{ mb: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor,
          borderRadius: 1,
          px: 1,
          opacity,
        }}
      >
        <DragIndicatorIcon sx={{ mr: 1, cursor: "grab" }} />

        <ListItemText primary={item.title} />

        <IconButton onClick={() => handleRename(item.id)}>
          <CreateIcon fontSize="small" />
        </IconButton>

        <IconButton onClick={() => handleToggleVisibility(item.id, item.visible === false)}>
          {item.visible === false ? (
            <VisibilityOffIcon fontSize="small" />
          ) : (
            <VisibilityIcon fontSize="small" />
          )}
        </IconButton>
      </Box>

      {/* Render children (indented) if any */}
      {children}
    </Box>
  );
}
