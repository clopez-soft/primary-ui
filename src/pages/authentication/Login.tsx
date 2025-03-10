import { experimentalStyled as styled } from "@mui/material";
import { Box, Card, Stack, Container, Typography } from "@mui/material";

import Page from "src/components/Page";
import AuthLayout from "src/layouts/AuthLayout";
import { MHidden } from "src/components/@material-extend";
import LoginForm from "src/pages/authentication/LoginForm";

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

export default function Login() {
  return (
    <RootStyle title="Sign in">
      <MHidden width="mdDown">
        <SectionStyle>
          <AuthLayout
            logo_sx={{
              paddingRight: 0,
              maxWidth: "50px",
            }}
          >
            {null}
          </AuthLayout>
          <br />
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hi, Welcome Back
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                Sign in
              </Typography>
            </Box>
          </Stack>

          <LoginForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
