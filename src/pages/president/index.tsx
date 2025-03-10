import { useState } from "react";
import { useQuery } from "@apollo/client";

import {
  Container,
  Grid,
  Card,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Skeleton,
} from "@mui/material";

import { PATH_DASHBOARD } from "src/routes/paths";
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import AlertMessage from "src/components/AlertMessage";
import { fMiles } from "src/utils/helper";

import { PRESIDENT_RESULT } from "./graph";
import { PresidentVotes } from "./type";

const initialPresident: PresidentVotes[] = [];

const PresidentResult = () => {
  const [presidentResumen, setPresidentResumen] = useState(initialPresident);
  const [count_record, setCount_record] = useState(0);
  const [total_votes, setTotal_votes] = useState(0);

  const { loading, error } = useQuery(PRESIDENT_RESULT, {
    fetchPolicy: "cache-and-network",
    onCompleted: (datos) => {
      if (!datos) return;

      if (!datos.presidentResults) return;

      if (!datos.presidentResults.president_votes) return;

      const candiates = datos.presidentResults.president_votes;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newResumen: PresidentVotes[] = candiates.map((item: any) => {
        return {
          movimiento_interno_id: item.movimiento_interno_id || "",
          movimiento_interno_code: item.movimiento_interno_code || "",
          movimiento_interno_image: item.movimiento_interno_image || "",

          political_alliance_id: item.political_alliance_id || "",
          political_alliance_code: item.political_alliance_code || "",
          political_alliance_image: item.political_alliance_image || "",

          candidate_id: item.candidate_id || "",
          candidate_name: item.candidate_name || "",
          candidate_image: item.candidate_image || "",
          candidate_flag: item.candidate_flag || "",

          number_box: item.number_box || 0,
          votes: item.votes || 0,
        } as PresidentVotes;
      });

      const sortResumen = newResumen.sort(function (a, b) {
        return b.votes - a.votes;
      });

      setPresidentResumen(sortResumen);
      setCount_record(+datos.presidentResults.count_record);
      setTotal_votes(+datos.presidentResults.total_votes);
    },
  });

  return (
    <Page title="Resultados Presidente">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Resultados Presidente"
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Presidencia" },
          ]}
        />
        <Card
          sx={{
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "20px",
            marginBottom: "20px",
          }}
        >
          <CardHeader title="Presidencia" sx={{ marginBottom: "15px" }} />
          {error && <AlertMessage message={error.message} type="error" />}
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={300} />
          ) : (
            <Grid container spacing={3} alignItems="stretch">
              <Grid item xs={12} md={12}>
                <Typography variant="h5" align="center">
                  Cantidad de Actas: {fMiles(count_record)} - Total de Votos:{" "}
                  {fMiles(total_votes)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" align="center">
                  Grafico
                </Typography>
                <List
                  sx={{ width: "100%", bgcolor: "background.paper" }}
                ></List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" align="center">
                  Votos
                </Typography>
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                    overflow: "auto",
                    maxHeight: 700,
                  }}
                >
                  {presidentResumen.map((item, index) => {
                    return (
                      <ListItem key={`ListItem-${index}-${item.candidate_id}`}>
                        <ListItemAvatar>
                          <Avatar
                            src={
                              item.movimiento_interno_image ||
                              item.political_alliance_image ||
                              item.candidate_flag
                            }
                            alt={item.movimiento_interno_code}
                            variant="square"
                            sx={{
                              height: "64px",
                              width: "128px",
                              objectFit: "cover",
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemAvatar>
                          <Avatar
                            src={item.candidate_image}
                            alt={item.movimiento_interno_code}
                            variant="square"
                            sx={{
                              height: "64px",
                              width: "64px",
                              objectFit: "cover",
                            }}
                          />
                        </ListItemAvatar>

                        <ListItemText
                          primary={`${item.candidate_name} (${
                            item.movimiento_interno_code ||
                            item.political_alliance_code
                          })`}
                          secondary={`Votos: ${fMiles(item.votes)}`}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
            </Grid>
          )}
        </Card>
      </Container>
    </Page>
  );
};

export default PresidentResult;
