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
import { HTML5Backend } from "react-dnd-html5-backend";
import { Identifier } from "dnd-core";
import { JSX } from "@emotion/react/jsx-runtime";

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

// Helper to reorder an array
function reorder<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...list];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

// Recursively reorder nav items within the same parent
function reorderNavItems(
  items: NavItemType[],
  parentId: number | null,
  fromIndex: number,
  toIndex: number
): NavItemType[] {
  if (parentId === null) {
    return reorder(items, fromIndex, toIndex);
  }
  return items.map((item) => {
    if (item.id === parentId && item.children) {
      const newChildren = reorder(item.children, fromIndex, toIndex);
      return { ...item, children: newChildren };
    }
    if (item.children && item.children.length > 0) {
      return {
        ...item,
        children: reorderNavItems(item.children, parentId, fromIndex, toIndex),
      };
    }
    return item;
  });
}

// Data passed during dragging
interface DragItem {
  type: string;
  id: number;
  parentId: number | null;
  index: number;
}

export default function SideNav() {
  // Navigation items state; initial value will be loaded from localStorage or fallback to dummy data
  const dummyNav: NavItemType[] = [
    { id: 1, title: "Dashboard", target: "/" },
    {
      id: 2,
      title: "Job Applications",
      target: "/applications",
      children: [
        { id: 7, title: "John Doe", target: "/applications/john-doe" },
        { id: 10, title: "James Bond", target: "/applications/james-bond" },
        {
          id: 20,
          title: "Scarlett Johansson",
          target: "/applications/scarlett-johansson",
          visible: false,
        },
      ],
    },
    {
      id: 3,
      title: "Companies",
      target: "/companies",
      visible: false,
      children: [
        { id: 8, title: "Tanqeeb", target: "/companies/1" },
        { id: 9, title: "Daftra", target: "/companies/2" },
        { id: 11, title: "TBD", target: "/companies/14" },
      ],
    },
    {
      id: 4,
      title: "Qualifications",
      target: "/qualifications",
      children: [
        { id: 14, title: "Q1", target: "/q1" },
        { id: 15, title: "Q2", target: "/q2" },
      ],
    },
    { id: 5, title: "About", target: "/about" },
    { id: 6, title: "Contact", target: "/contact" },
  ];

  const [navItems, setNavItems] = useState<NavItemType[]>(dummyNav);
  const [editMode, setEditMode] = useState(false);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  // On mount, load navigation from localStorage if available
  useEffect(() => {
    const storedNav = localStorage.getItem("navItems");
    if (storedNav) {
      try {
        setNavItems(JSON.parse(storedNav));
      } catch (err) {
        console.error("Error parsing stored nav data", err);
      }
    }
  }, []);

  // === Edit Mode Handlers ===
  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleDiscardChanges = () => {
    // Reload nav items from localStorage or fallback to dummy data
    const storedNav = localStorage.getItem("navItems");
    if (storedNav) {
      setNavItems(JSON.parse(storedNav));
    } else {
      setNavItems(dummyNav);
    }
    setEditMode(false);
  };

  const handleSaveChanges = () => {
    // Save the current navItems to localStorage.
    // In a real backend scenario, you would POST this JSON to an API endpoint.
    localStorage.setItem("navItems", JSON.stringify(navItems));
    setEditMode(false);
  };

  // === Visibility / Rename Handlers (for edit mode) ===
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

  // === Expand/Collapse Logic (for view mode) ===
  const handleToggleExpand = (itemId: number) => {
    setExpandedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const isTopLevelItem = (item: NavItemType) =>
    !navItems.some((nav) => nav.children?.includes(item));

  // === Move item among siblings (for drag-and-drop) ===
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
        <Box sx={{ backgroundColor, borderRadius: 1, my: 0.5 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: hasChildren ? "pointer" : "default", px: 1 }}
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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Menu
          </Typography>
          {!editMode ? (
            <IconButton onClick={handleToggleEditMode}>
              <SettingsIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Discard changes */}
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
              {/* Save changes */}
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
        <Divider sx={{ mb: 2 }} />
        {editMode ? (
          <Box>{renderEditModeTree(navItems, null)}</Box>
        ) : (
          <Box>{navItems.map((item) => renderViewModeItem(item))}</Box>
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

  // Reduce opacity if the item is hidden
  const opacity = item.visible === false ? 0.5 : 1;
  const backgroundColor = isTopLevel ? "#F5F5F5" : "transparent";

  const [{}, drag] = useDrag({
    type: NAV_ITEM_TYPE,
    item: () => ({
      type: NAV_ITEM_TYPE,
      id: item.id,
      parentId,
      index,
    }),
    collect: () => ({}),
  });

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: NAV_ITEM_TYPE,
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
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
      {children}
    </Box>
  );
}
