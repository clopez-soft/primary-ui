import { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { experimentalStyled as styled } from "@mui/material";
import { Typography, BoxProps } from "@mui/material";

import Logo from "src/components/Logo";
import { MHidden } from "src/components/@material-extend";

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  padding: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

type AuthLayoutProps = {
  children: ReactNode;
  logo_sx?: BoxProps;
};

export default function AuthLayout({ children, logo_sx }: AuthLayoutProps) {
  return (
    <HeaderStyle>
      <RouterLink to="/">
        <Logo sx={logo_sx} />
      </RouterLink>

      <MHidden width="smDown">
        <Typography
          variant="body2"
          sx={{
            mt: { md: -2 },
          }}
        >
          {children}
        </Typography>
      </MHidden>
    </HeaderStyle>
  );
}
