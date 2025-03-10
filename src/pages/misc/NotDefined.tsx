import { Container, Typography } from "@mui/material";

import Page from "src/components/Page";

export default function NotDefined() {
  const path = window.location.pathname;
  return (
    <Page title="Not defined">
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          Not defined : {path}
        </Typography>
        <hr />
        <br />
        <Typography gutterBottom>
          The page you want to access has not yet been created
        </Typography>
      </Container>
    </Page>
  );
}
