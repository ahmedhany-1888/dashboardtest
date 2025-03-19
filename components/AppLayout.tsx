// components/AppLayout.tsx
"use client";
import React, { FC, useState } from 'react';
import AppBar from './AppBar';
import SideNav from './SideNav';
import { Box, Drawer, useMediaQuery, Theme } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box>
        <AppBar onMenuClick={toggleDrawer(true)} />
        <Box display="flex">
          {/* Desktop sidebar */}
          {!isMobile && <SideNav />}
          {/* Mobile drawer sidebar */}
          {isMobile && (
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <SideNav />
              </Box>
            </Drawer>
          )}
          {/* Main Content */}
          <Box flexGrow={1} p={2}>
            {children}
          </Box>
        </Box>
      </Box>
    </DndProvider>
  );
};

export default AppLayout;
