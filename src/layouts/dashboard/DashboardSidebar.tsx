import { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
import { Box, Drawer, Typography, Avatar } from "@mui/material";
// hooks
import useAuth from "src/hooks/useAuth";
// components
import Logo from "src/components/Logo";
import Scrollbar from "src/components/Scrollbar";
import NavSection from "src/components/NavSection";
import { MHidden } from "src/components/@material-extend";
//
import { getSidebarConfigAuth } from "./SidebarConfig";
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  boxShadow: "none",
  backgroundColor: theme.palette.grey[500_12],
}));

function substring(text: string, start = 0, maxLenght = 20) {
  if (!text) return "";

  if (text.length > maxLenght) return text.substring(start, maxLenght) + "...";

  return text;
}

type DashboardSidebarProps = {
  isOpenSidebar: boolean;
  onCloseSidebar: VoidFunction;
};

export default function DashboardSidebar({
  isOpenSidebar,
  onCloseSidebar,
}: DashboardSidebarProps) {
  const { pathname } = useLocation();
  const { user, isAuthenticated, permissions } = useAuth();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ px: 2.5, py: 3 }}>
        <Box component={RouterLink} to="/" sx={{ display: "inline-flex" }}>
          <Logo sx={{ width: 40, height: 40, padding: 0 }} />
        </Box>
      </Box>

      <Box sx={{ mb: 2, mx: 2.5 }}>
        <AccountStyle>
          <Avatar
            alt={user?.screen_name || "User"}
            src={
              user?.picture || "/static/mock-images/avatars/avatar_default.jpg"
            }
          />
          <Box sx={{ ml: 2 }}>
            <Typography
              variant="subtitle2"
              noWrap
              sx={{ color: "text.primary" }}
            >
              {isAuthenticated
                ? substring(user?.screen_name || "", 0, 19)
                : "name"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
              {isAuthenticated
                ? substring(user?.email || "email", 0, 19)
                : "email"}
            </Typography>
          </Box>
        </AccountStyle>
      </Box>

      <NavSection navConfig={getSidebarConfigAuth(permissions)} />
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: { width: DRAWER_WIDTH, bgcolor: "background.default" },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
