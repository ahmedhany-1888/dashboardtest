"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Switch,
  Paper,
  Grid,
  IconButton,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  Drawer,
  useMediaQuery,
  Theme,
  InputBase,
  Badge,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";

import SideNav from "@/components/SideNav";

// ===== Sample data for testing =====
const jobList = [
  {
    id: 1,
    title: "Gaming UI Designer",
    company: "Rockstar Games",
    location: "El Mansoura, Egypt",
    posted: "10 days ago",
    experience: "0 - 3yr exp",
    jobType: "Full time",
    mode: "Remote",
    skills: "Creative / Design — IT / Software development — Gaming",
    logoUrl: "",
    highlighted: true,
  },
  {
    id: 2,
    title: "Senior UX UI Designer",
    company: "Egabi",
    location: "Cairo, Egypt",
    posted: "1 month ago",
    experience: "0 - 3yr exp",
    jobType: "Full time",
    mode: "Hybrid",
    skills: "Creative / Design — IT / Software development",
    logoUrl: "",
    highlighted: false,
  },
];

// ===== Styled Components =====

// Page container
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

// ===== Desktop Header (Green Box) =====
const DesktopHeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#48A74C",
  color: "#fff",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

// ===== Mobile Header Container =====
const MobileHeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

// ===== Hamburger Icon Container =====
const HamburgerContainer = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: theme.spacing(0.5),
  width: 48,
  height: 48,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

// ===== Sorting Row =====
const SortingRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

// ===== Search Bar for Desktop Header =====
const SearchBarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#FFF",
  borderRadius: 9999,
  height: "40px",
  padding: "0 12px",
  minWidth: "300px",
  [theme.breakpoints.down("md")]: {
    minWidth: "220px",
  },
  [theme.breakpoints.down("sm")]: {
    display: "none", // Hide search bar on mobile
  },
}));

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

// ===== Icon + label stack for desktop icons =====
const IconLabelStack = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer",
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
}));

const VerticalDivider = styled(Box)(({ theme }) => ({
  borderLeft: "1px solid #D6D6D699",
  height: "40px",
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
}));

const iconStyle = {
  width: 28,
  height: 28,
  color: "#999",
};

const labelStyle = (theme: Theme) => ({
  fontFamily: "DM Sans, sans-serif",
  fontSize: "14px",
  marginTop: 4,
  fontWeight: 100,
  color: "#E6E6E6",
  [theme.breakpoints.down("xs")]: {
    display: "none",
  },
});

// ===== Favorite Icon Container (Job Cards) =====
const FavoriteIconContainer = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#FFF",
  border: "1px solid #ccc",
  borderRadius: "50%",
  width: 36,
  height: 36,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

// ===== HomePage Component =====
export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  // State for alert switch and sorting
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSort, setSelectedSort] = useState<string>("Top match");

  // Mobile Drawer state for nav
  const [navOpen, setNavOpen] = useState(false);

  const handleSwitchChange = () => {
    setAlertEnabled(!alertEnabled);
  };

  const handleOpenSortMenu = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };
  const handleCloseSortMenu = () => {
    setSortAnchorEl(null);
  };
  const handleSelectSort = (sortOption: string) => {
    setSelectedSort(sortOption);
    setSortAnchorEl(null);
  };

  return (
    <div suppressHydrationWarning>
      <PageContainer>
        {/* === Sorting Row === */}
        <SortingRow>
          <Typography variant="body1" sx={{ mr: 1, color: "#000", fontWeight: 400 }}>
            Sorting by:
          </Typography>
          <Typography variant="body1" sx={{ color: "#48A74C", mr: 0.5 }}>
            {selectedSort}
          </Typography>
          <IconButton
            size="small"
            onClick={handleOpenSortMenu}
            aria-label="Open sort menu"
            sx={{ p: 0, color: "#48A74C" }}
          >
            <ArrowDropDownIcon />
          </IconButton>
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={handleCloseSortMenu}
            PaperProps={{
              sx: { width: 220, borderRadius: 2, p: 1 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
              <Typography sx={{ color: "#000", mr: 1 }}>Sorting by:</Typography>
              <Typography sx={{ color: "#48A74C", mr: 0.5 }}>{selectedSort}</Typography>
              <ArrowDropDownIcon sx={{ color: "#48A74C" }} />
            </Box>
            <Divider sx={{ mb: 1 }} />
            {["Top match", "Newest", "Latest"].map((option) => (
              <MenuItem
                key={option}
                onClick={() => handleSelectSort(option)}
                sx={{ color: selectedSort === option ? "#48A74C" : "#000" }}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </SortingRow>

        {/* === Header Section === */}
        {isMobile ? (
          // Mobile Layout: Green header + hamburger icon to open nav Drawer
          <MobileHeaderContainer>
            <Box
              sx={{
                flex: 1,
                backgroundColor: "#48A74C",
                color: "#fff",
                borderRadius: 2,
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 550 }}>
                UI Designer in Egypt
              </Typography>
              <Typography variant="body2">70 job positions</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Set alert
                </Typography>
                <Switch
                  checked={alertEnabled}
                  onChange={handleSwitchChange}
                  color="success"
                />
              </Box>
            </Box>
            <HamburgerContainer onClick={() => setNavOpen(true)}>
              <MenuIcon sx={{ fontSize: 16, color: "#666" }} />
            </HamburgerContainer>
            <Drawer
              anchor="left"
              open={navOpen}
              onClose={() => setNavOpen(false)}
              
            >
              {/* Render the full SideNav component (with all functionalities) */}
              <SideNav />
            </Drawer>
          </MobileHeaderContainer>
        ) : (
          // Desktop Layout: Green header with job info, alert, and search bar
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#48A74C",
              color: "#fff",
              borderRadius: 2,
              p: 2,
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 550 }}>
                UI Designer in Egypt
              </Typography>
              <Typography variant="body2">70 job positions</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Set alert
              </Typography>
              <Switch
                checked={alertEnabled}
                onChange={handleSwitchChange}
                color="success"
              />
            </Box>
            <SearchBarContainer>
              <GreenIconWrapper>
                <SearchIcon sx={{ color: "#FFF", width: "21px", height: "24px" }} />
              </GreenIconWrapper>
              <StyledInputBase placeholder="Search by name, job title..." inputProps={{ "aria-label": "search" }} />
            </SearchBarContainer>
          </Box>
        )}

        {/* === Job List === */}
        <Grid container spacing={2}>
          {jobList.map((job) => {
            const tagBg = job.highlighted ? "#FFF" : "#F5F5F5";
            return (
              <Grid item xs={12} key={job.id}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: job.highlighted ? "#ECFFEB" : "#FFF",
                  }}
                >
                  {/* Row 1: Logo, Title, Company, Favorite Icon */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <Avatar
                        src={job.logoUrl}
                        alt={job.company}
                        sx={{
                          width: 48,
                          height: 48,
                          mr: 2,
                          backgroundColor: "#FFF",
                          border: "1px solid #ccc",
                        }}
                      >
                        {job.company[0] ?? ""}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {job.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#48A74C" }}>
                          {job.company}
                        </Typography>
                      </Box>
                    </Box>
                    <FavoriteIconContainer>
                      <FavoriteBorderIcon sx={{ color: "#999" }} />
                    </FavoriteIconContainer>
                  </Box>

                  {/* Row 2: Location & Calendar Icons */}
                  <Box sx={{ display: "flex", gap: 3, mb: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.posted}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Row 3: Tag Boxes for Experience, Job Type, Mode */}
                  <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.5,
                        backgroundColor: tagBg,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {job.experience}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.5,
                        backgroundColor: tagBg,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {job.jobType}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.5,
                        backgroundColor: tagBg,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {job.mode}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Divider */}
                  <Divider sx={{ mb: 1 }} />

                  {/* Row 4: Skills */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {job.skills}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </PageContainer>
    </div>
  );
}
