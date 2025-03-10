import { useState } from "react";
import { useLazyQuery } from "@apollo/client";

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
import SelectMunicipality from "src/components/selects/selectMunicipality";
import { fMiles } from "src/utils/helper";

import { MAYOR_RESULT } from "./graph";
import { MayorPosition, MayorResumen, MayorVotes } from "./type";

const initialMayorPosition: MayorPosition[] = [];
const initialMayorResumen: MayorResumen[] = [];
const initialMayorVotes: MayorVotes[] = [];

const MayorResult = () => {
  const [mayorPosition, setMayorPosition] = useState(initialMayorPosition);
  const [mayorResumen, setMayorResumen] = useState(initialMayorResumen);
  const [mayorVotes, setMayorVotes] = useState(initialMayorVotes);
  const [count_record, setCount_record] = useState(0);
  const [total_votes, setTotal_votes] = useState(0);
  const [municipalityId, setMunicipalityId] = useState("");

  const [mayorResults, { loading, error }] = useLazyQuery(MAYOR_RESULT, {
    fetchPolicy: "cache-and-network",
    onCompleted: (datos) => {
      if (!datos) {
        setMayorPosition(initialMayorPosition);
        setMayorResumen(initialMayorResumen);
        setMayorVotes(initialMayorVotes);
        setCount_record(0);
        setTotal_votes(0);
        return;
      }

      if (!datos.mayorResults) {
        setMayorPosition(initialMayorPosition);
        setMayorResumen(initialMayorResumen);
        setMayorVotes(initialMayorVotes);
        setCount_record(0);
        setTotal_votes(0);
        return;
      }

      if (!datos.mayorResults.positions) {
        setMayorPosition(initialMayorPosition);
        setMayorResumen(initialMayorResumen);
        setMayorVotes(initialMayorVotes);
        setCount_record(0);
        setTotal_votes(0);
        return;
      }

      if (!datos.mayorResults.marks) {
        setMayorPosition(initialMayorPosition);
        setMayorResumen(initialMayorResumen);
        setMayorVotes(initialMayorVotes);
        setCount_record(0);
        setTotal_votes(0);
        return;
      }

      const results = datos.mayorResults.positions;
      const marks = datos.mayorResults.marks;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newPosition: MayorPosition[] = results.map((item: any) => {
        return {
          movimiento_interno_id: item.movimiento_interno_id || "",
          movimiento_interno_code: item.movimiento_interno_code || "",
          movimiento_interno_image: item.movimiento_interno_image || "",
          position: (+item.position || 0) + 1,
        } as MayorPosition;
      });
      const sortPosition: MayorPosition[] = newPosition?.sort(function (a, b) {
        return a.position - b.position;
      });

      const ids =
        newPosition
          ?.filter((item) => item.movimiento_interno_id)
          .map((item) => item.movimiento_interno_id) || [];
      const uniqueIds = [...new Set(ids)];

      const newResumen: MayorResumen[] = [];
      for (const id of uniqueIds) {
        const rows = newPosition.filter(
          (item) => item.movimiento_interno_id === id
        );
        if (rows.length > 0) {
          const newRow: MayorResumen = {
            movimiento_interno_id: rows[0].movimiento_interno_id || "",
            movimiento_interno_code: rows[0].movimiento_interno_code || "",
            movimiento_interno_image: rows[0].movimiento_interno_image || "",
            positions: rows.length,
          };
          newResumen.push(newRow);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newVotes: MayorVotes[] = marks.map((item: any) => {
        return {
          movimiento_interno_id: item.movimiento_interno_id || "",
          movimiento_interno_code: item.movimiento_interno_code || "",
          movimiento_interno_image: item.movimiento_interno_image || "",
          votes: +item.totalmark || 0,
        } as MayorVotes;
      });
      const sortVotes: MayorVotes[] = newVotes?.sort(function (a, b) {
        return b.votes - a.votes;
      });

      setMayorPosition(sortPosition);
      setMayorVotes(sortVotes);
      setMayorResumen(newResumen);
      setCount_record(+datos.mayorResults.count_record);
      setTotal_votes(+datos.mayorResults.total_votes);
    },
  });

  const handleMunicipality = (municipality: string) => {
    if (municipality) {
      mayorResults({ variables: { municipality_id: municipality } });
    } else {
      setMayorPosition(initialMayorPosition);
      setMayorResumen(initialMayorResumen);
      setMayorVotes(initialMayorVotes);
      setCount_record(0);
      setTotal_votes(0);
    }
    setMunicipalityId(municipality);
  };

  return (
    <Page title="Resultados Alcaldia">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Resultados Alcaldia"
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Resultado Alcaldia" },
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
          <CardHeader
            title="Alcaldes del Departamento de Yoro"
            sx={{ marginBottom: "15px" }}
          />
          {error && <AlertMessage message={error.message} type="error" />}
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={300} />
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <SelectMunicipality
                  onSelect={handleMunicipality}
                  value={municipalityId}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography variant="h5" align="center">
                  Cantidad de Actas: {fMiles(count_record)} - Total de Votos:{" "}
                  {fMiles(total_votes)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" align="center">
                  Distribucion Corporacion
                </Typography>
                <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                  {mayorPosition?.map((item, index) => {
                    return (
                      <ListItem
                        key={`ListItem-${index}-${item.movimiento_interno_id}`}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={item.movimiento_interno_image}
                            alt={item.movimiento_interno_code}
                            variant="square"
                            sx={{
                              height: "64px",
                              width: "128px",
                              objectFit: "cover",
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={`Partido - ${item.movimiento_interno_code}`}
                          secondary={`Posicion: ${item.position}`}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" align="center">
                  Votos
                </Typography>
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                    overflow: "auto",
                    maxHeight: 800,
                  }}
                >
                  {mayorVotes?.map((item, index) => {
                    return (
                      <ListItem
                        key={`ListItem-${index}-${item.movimiento_interno_id}`}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={item.movimiento_interno_image}
                            alt={item.movimiento_interno_code}
                            variant="square"
                            sx={{
                              height: "64px",
                              width: "128px",
                              objectFit: "cover",
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={`Partido - ${item.movimiento_interno_code}`}
                          secondary={`Votos: ${fMiles(item.votes)}`}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="h6" align="center">
                  Puestos Ganados
                </Typography>
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                    overflow: "auto",
                    maxHeight: 700,
                  }}
                >
                  {mayorResumen?.map((item, index) => {
                    return (
                      <ListItem
                        key={`ListItem-${index}-${item.movimiento_interno_id}`}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={item.movimiento_interno_image}
                            alt={item.movimiento_interno_code}
                            variant="square"
                            sx={{
                              height: "64px",
                              width: "128px",
                              objectFit: "cover",
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={`Partido - ${item.movimiento_interno_code}`}
                          secondary={`Cupos Ganados: ${item.positions}`}
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

export default MayorResult;
