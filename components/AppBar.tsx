"use client";

import React, { FC, useState } from "react";
import {
  AppBar as MUIAppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Drawer,
  useMediaQuery,
  Theme,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

interface AppBarProps {
  onMenuClick?: () => void;
}

// 1) Custom AppBar with black background (#161616)
const CustomAppBar = styled(MUIAppBar)({
  backgroundColor: "#161616",
  boxShadow: "none",
});

// 2) Container to center the content (Desktop)
const AppBarContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1744px",
  height: "80px",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
  [theme.breakpoints.down("sm")]: {
    padding: "0 10px",
  },
}));

// Left Section: iZAM + Search bar 
const LeftSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "25px", 
});

const IZAMText: React.FC = () => (
  <Typography
    sx={{
      fontFamily: "DM Sans, sans-serif",
      fontWeight: 700,
      fontSize: "25px",
      marginLeft: "40px",
      lineHeight: "26.22px",
      color: "#FFFFFF",
    }}
  >
    i
    <Box component="span" sx={{ color: "#48A74C" }}>
      Z
    </Box>
    AM
  </Typography>
);

// Search bar container
const SearchBarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  borderRadius: 9999,
  height: "40px",
  padding: "0 12px",
  minWidth: "300px",
  [theme.breakpoints.down("md")]: {
    minWidth: "220px",
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: "160px",
  },
}));

// Green circle behind the search icon
const GreenIconWrapper = styled(Box)({
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  backgroundColor: "#48A74C",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "8px",
});


const StyledInputBase = styled(InputBase)({
  flex: 1,
  fontSize: "14px",
  color: "#000",
});


const IconLabelStack = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textDecoration: "none",
  cursor: "pointer",
  marginRight: "15px",
  marginLeft: "15px",
  [theme.breakpoints.down("sm")]: {
    marginLeft: "5px",
    marginRight: "5px",
  },
}));

// Vertical divider styling
const VerticalDivider = styled(Box)(({ theme }) => ({
  borderLeft: "1px solid #D6D6D699",
  height: "40px",
  marginRight: "10px",
  marginLeft: "10px",
}));


const iconStyle = {
  width: 28,
  height: 28,
  color: "#999",
};

const labelStyle = (theme: Theme) => ({
  fontFamily: "DM Sans, sans-serif",
  fontSize: "14px",
  marginTop: "4px",
  fontWeight: 100,
  color: "#E6E6E6",
  [theme.breakpoints.down("xs")]: {
    display: "none",
  },
});

const AppBar: FC<AppBarProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  // === Profile Menu State (Desktop) ===
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const handleOpenProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };
  const handleCloseProfileMenu = () => {
    setProfileAnchorEl(null);
  };
  const handleLogout = () => {
    console.log("User logged out");
    setProfileAnchorEl(null);
  };

  // === Mobile Drawer State ===
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <CustomAppBar position="static">
      <Toolbar sx={{ minHeight: "65px", padding: 0 }}>
        {isMobile ? (
          /* ===== Mobile Layout ===== */
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
              px: 2,
            }}
          >
            {/* Left: Avatar with embedded menu icon */}
            <Box sx={{ position: "relative", width: 48, height: 48 }}>
              <Avatar
                src="https://via.placeholder.com/80"
                alt="Ahmed Amaar"
                sx={{ width: 48, height: 48 }}
              />
              <IconButton
                onClick={toggleDrawer(true)}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  backgroundColor: "#FFF",
                  border: "1px solid #ccc",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MenuIcon sx={{ fontSize: 16, color: "#666" }} />
              </IconButton>
            </Box>
            <IZAMText />
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
              <Box sx={{ width: 250, p: 2 }}>
                {/* User Info */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    src="https://via.placeholder.com/72"
                    alt="Ahmed Amaar"
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Ahmed Amaar
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      UX UI designer
                    </Typography>
                  </Box>
                </Box>
                {/* Nav Items */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <HomeIcon fontSize="small" sx={{ color: "#666" }} />
                    <Typography variant="body2">Home</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WorkIcon fontSize="small" sx={{ color: "#666" }} />
                    <Typography variant="body2">Jobs</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BusinessIcon fontSize="small" sx={{ color: "#666" }} />
                    <Typography variant="body2">Employers</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <NotificationsIcon fontSize="small" sx={{ color: "#666" }} />
                    <Typography variant="body2">Notifications</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MailIcon fontSize="small" sx={{ color: "#666" }} />
                    <Typography variant="body2">Messaging</Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography variant="body2">Setting and privacy</Typography>
                  <Typography variant="body2">Language</Typography>
                  <Typography variant="body2">Help</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                    <LogoutIcon fontSize="small" sx={{ color: "red" }} />
                    <Typography variant="body2" sx={{ color: "red" }}>
                      Logout
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Drawer>
          </Box>
        ) : (
          /* ===== Desktop Layout ===== */
          <AppBarContainer>
            <LeftSection>
              <IZAMText />
              <SearchBarContainer>
                <GreenIconWrapper>
                  <SearchIcon sx={{ color: "#FFF", width: "21px", height: "24px" }} />
                </GreenIconWrapper>
                <StyledInputBase
                  placeholder="Search by name, job title..."
                  inputProps={{ "aria-label": "search" }}
                />
              </SearchBarContainer>
            </LeftSection>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <IconLabelStack>
                <IconButton sx={{ p: 0 }}>
                  <HomeIcon sx={iconStyle} />
                </IconButton>
                <Typography sx={labelStyle(theme)}>Home</Typography>
              </IconLabelStack>
              <IconLabelStack>
                <IconButton sx={{ p: 0 }}>
                  <WorkIcon sx={iconStyle} />
                </IconButton>
                <Typography sx={labelStyle(theme)}>Jobs</Typography>
              </IconLabelStack>
              <IconLabelStack>
                <IconButton sx={{ p: 0 }}>
                  <BusinessIcon sx={iconStyle} />
                </IconButton>
                <Typography sx={labelStyle(theme)}>Employers</Typography>
              </IconLabelStack>
              <VerticalDivider />
              <IconLabelStack>
                <IconButton sx={{ p: 0 }}>
                  <NotificationsIcon sx={iconStyle} />
                </IconButton>
                <Typography sx={labelStyle(theme)}>Notifications</Typography>
              </IconLabelStack>
              <IconLabelStack>
                <IconButton sx={{ p: 0 }}>
                  <Badge badgeContent={1} color="error" overlap="circular">
                    <MailIcon sx={iconStyle} />
                  </Badge>
                </IconButton>
                <Typography sx={labelStyle(theme)}>Messaging</Typography>
              </IconLabelStack>
              <IconLabelStack onClick={handleOpenProfileMenu}>
                <IconButton sx={{ p: 0 }}>
                  <AccountCircleIcon sx={iconStyle} />
                </IconButton>
                <Box sx={{ display: "flex", alignItems: "center", gap: "1px" }}>
                  <Typography sx={labelStyle(theme)}>Profile</Typography>
                  <ArrowDropDownIcon sx={iconStyle} />
                </Box>
              </IconLabelStack>
              <Menu
                anchorEl={profileAnchorEl}
                open={Boolean(profileAnchorEl)}
                onClose={handleCloseProfileMenu}
                PaperProps={{
                  sx: {
                    width: 240,
                    borderRadius: 2,
                    p: 1,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
                  <Avatar
                    src="https://via.placeholder.com/72"
                    alt="Ahmed Amaar"
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Ahmed Amaar
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      UX UI designer
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={handleCloseProfileMenu}>
                  Setting and privacy
                </MenuItem>
                <MenuItem onClick={handleCloseProfileMenu}>Language</MenuItem>
                <MenuItem onClick={handleCloseProfileMenu}>Help</MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </AppBarContainer>
        )}
      </Toolbar>
    </CustomAppBar>
  );
};

export default AppBar;
