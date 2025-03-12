import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

import {
  Container,
  // Grid,
  Card,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Skeleton,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { PATH_DASHBOARD } from "src/routes/paths";
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import AlertMessage from "src/components/AlertMessage";
import SelectMunicipality from "src/components/selects/selectMunicipality";
import { fMiles, toSafeString } from "src/utils/helper";

import { CONGRESS_RESULT } from "./graph";
import { CandidateCongress, QuotientParty } from "./type";

const initialCandiate: CandidateCongress[] = [];
const initialQuotientParty: QuotientParty[] = [];

const CongressResult = () => {
  const [candiatesElectos, setCandiatesElectos] = useState(initialCandiate);
  const [candiatesList, setCandiatesList] = useState(initialCandiate);
  const [candiatesListSort, setCandiatesListSort] = useState(initialCandiate);
  const [quotientParty, setQuotientParty] = useState(initialQuotientParty);
  const [count_record, setCount_record] = useState(0);
  const [total_votes, setTotal_votes] = useState(0);

  const [muni_id, setMuni_id] = useState("");

  const { loading, error } = useQuery(CONGRESS_RESULT, {
    fetchPolicy: "cache-and-network",
    variables: toSafeString(muni_id) !== "" ? { municipality_id: muni_id } : {},
    onError: () => {
      setCandiatesList(initialCandiate);
      setQuotientParty(initialQuotientParty);
      setCount_record(0);
      setTotal_votes(0);
    },
    onCompleted: (datos) => {
      if (!datos) return;

      if (!datos.congressResults) return;

      if (!datos.congressResults.candidate_congress) return;

      // if (+datos.congressResults.count_record === 0) {
      //   setCandiatesList(initialCandiate);
      //   setCandiatesElectos(initialCandiate);
      //   setQuotientParty(initialQuotientParty);
      // }

      const candiates = datos.congressResults.candidate_congress;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newCandidates: CandidateCongress[] = candiates.map((item: any) => {
        return {
          movimiento_interno_id: item.movimiento_interno_id || "",
          movimiento_interno_code: item.movimiento_interno_code || "",
          movimiento_interno_image: item.movimiento_interno_image || "",
          candidate_id: item.candidate_id || "",
          number_box: item.number_box || 0,
          candidate_name: item.candidate_name || "",
          candidate_image: item.candidate_image || "",
          marks: item.marks || 0,
        } as CandidateCongress;
      });

      if (!datos.congressResults.positions_by_party) return;

      const positions = datos.congressResults.positions_by_party;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newPositions: QuotientParty[] = positions.map((item: any) => {
        const party =
          newCandidates.find(
            (c) => c.movimiento_interno_id === item.movimiento_interno_id
          ) || undefined;
        return {
          movimiento_interno_id: item.movimiento_interno_id || "",
          movimiento_interno_code: party?.movimiento_interno_code || "",
          movimiento_interno_image: party?.movimiento_interno_image || "",
          marks: +item.marks || 0,
          positions: +item.positions || 0,
          quotient: +item.quotient || 0,
          positions_extra: +item.positions_extra || 0,
        } as QuotientParty;
      });

      setCandiatesList(newCandidates);
      setQuotientParty(newPositions);
      setCount_record(+datos.congressResults.count_record);
      setTotal_votes(+datos.congressResults.total_votes);
    },
  });

  useEffect(() => {
    if (!(candiatesList.length > 0 && quotientParty.length > 0)) {
      setCandiatesElectos(initialCandiate);
      setCandiatesListSort(initialCandiate);
      return;
    }
    let newElectos2: CandidateCongress[] = [];
    let newMarcas: CandidateCongress[] = [];
    const sortElectos2: CandidateCongress[] = candiatesList?.sort(function (
      a,
      b
    ) {
      return b.marks - a.marks;
    });

    if (sortElectos2.length >= 9) {
      newElectos2 = sortElectos2.slice(0, 9);
      newMarcas = sortElectos2.slice(9);
    }

    // const newElectos: CandidateCongress[] = [];
    // for (const party of quotientParty) {
    //   const positionsParty = party.positions + party.positions_extra;
    //   const candidateParty = candiatesList.filter(
    //     (c) => c.movimiento_interno_id === party.movimiento_interno_id
    //   );
    //   const tempElectos = candidateParty.slice(0, positionsParty);
    //   newElectos.push(...tempElectos);
    // }
    // const newList: CandidateCongress[] = candiatesList.filter(
    //   (c) =>
    //     newElectos.findIndex((e) => e.candidate_id === c.candidate_id) === -1
    // );

    // const sortElectos: CandidateCongress[] = newElectos?.sort(function (a, b) {
    //   return b.marks - a.marks;
    // });
    // const sortNewList: CandidateCongress[] = newList?.sort(function (a, b) {
    //   return b.marks - a.marks;
    // });
    setCandiatesElectos(newElectos2);
    setCandiatesListSort(newMarcas);
  }, [candiatesList, quotientParty]);

  return (
    <Page title="Resultados Congreso">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Resultados Congreso"
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Diputados al Congreso" },
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
          <CardHeader title="Diputados Yoro" sx={{ marginBottom: "15px" }} />
          {error && <AlertMessage message={error.message} type="error" />}
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={300} />
          ) : (
            <Grid container spacing={3} size="grow">
              <Grid size={12}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  spacing={2}
                >
                  <SelectMunicipality
                    value={muni_id}
                    onSelect={(value) => setMuni_id(toSafeString(value))}
                  />
                </Stack>
              </Grid>
              <Grid size={12}>
                <Typography variant="h5" align="center">
                  Cantidad de Actas: {fMiles(count_record)} - Total de Marcas:{" "}
                  {fMiles(total_votes)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" align="center">
                  Electos
                </Typography>
                <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                  {candiatesElectos.map((item, index) => {
                    return (
                      <ListItem key={`ListItem-${index}-${item.candidate_id}`}>
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
                          primary={`${item.number_box} - ${item.candidate_name}`}
                          secondary={`Marcas: ${fMiles(item.marks)}`}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" align="center">
                  Marcas
                </Typography>
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                    overflow: "auto",
                    maxHeight: 700,
                  }}
                >
                  {candiatesListSort.map((item, index) => {
                    return (
                      <ListItem key={`ListItem-${index}-${item.candidate_id}`}>
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
                          primary={`${item.number_box} - ${item.candidate_name}`}
                          secondary={`Marcas: ${fMiles(item.marks)}`}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>

              {/* <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h6" align="center">
                  Estadistica
                </Typography>
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                    overflow: "auto",
                    maxHeight: 700,
                  }}
                >
                  {quotientParty.map((item, index) => {
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
                          primary={`Enteras: ${item.positions} || Cociente: ${item.positions_extra}`}
                          secondary={`Marcas: ${fMiles(item.marks)}`}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Grid> */}
            </Grid>
          )}
        </Card>
      </Container>
    </Page>
  );
};

export default CongressResult;
