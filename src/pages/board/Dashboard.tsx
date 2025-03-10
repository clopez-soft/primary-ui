import { Container } from "@mui/material";

import Page from "src/components/Page";
// import President from './president';
// import Mayor from './mayor';
// import Congress from './congress';

export default function Dashboard() {
  return (
    <Page title="Resumen de Resultados">
      <Container maxWidth="xl">
        <img
          src={"img/logo.png"}
          alt={"logo"}
          style={{
            width: "45%",
            objectFit: "cover",
            margin: "auto",
          }}
        />
        {/* <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <President />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Mayor />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Congress />
                    </Grid>
                </Grid> */}
      </Container>
    </Page>
  );
}
