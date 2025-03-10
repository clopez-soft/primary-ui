/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from "react";
import { useQuery } from "@apollo/client";
import {
  Skeleton,
  Card,
  // Grid,
  Avatar,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import AlertMessage from "src/components/AlertMessage";
import { RecordFormikProps, RecordDetail } from "../type";
import { GET_BALLOT } from "../graph";
import { toSafeString, toSafeNumber } from "src/utils/helper";

type Props = {
  location_id: string;
  formik: RecordFormikProps;
};

const Mayor = ({ location_id, formik }: Props) => {
  const { getFieldProps, setFieldValue, values } = formik;
  const { data, loading, error } = useQuery(GET_BALLOT, {
    variables: { level: "MAYOR", location_id: location_id },
    fetchPolicy: "cache-first",
    onCompleted: (data) => {
      if (!data) return;

      if (!data.ballotByLevel) return;

      const detail = values.detail;
      if (detail.length === 0) {
        const NewDetail: RecordDetail[] = data?.ballotByLevel?.map(
          (item: any) => {
            return {
              detail_id: "",
              movimiento_interno_id:
                item?.movimiento_interno?.movimiento_interno_id || "",
              political_alliance_id:
                item?.political_alliance?.political_alliance_id || "",
              candidate_id: item?.candidate_id || "",
              number_box: +item?.candidate_box || undefined,
              votes: undefined,
            } as RecordDetail;
          }
        );
        setFieldValue("detail", NewDetail);
      }
    },
  });

  const handleChangeVotes = (vote: string, candidate_id: string) => {
    const detailItemIndex = values.detail.findIndex(
      (item) => item.candidate_id === candidate_id
    );
    if (detailItemIndex > -1) {
      let updateDetail: RecordDetail[] = values.detail || [];
      updateDetail = updateDetail.map((item, index) => {
        if (index === detailItemIndex) {
          return {
            ...item,
            votes: toSafeNumber(vote),
          };
        } else {
          return item;
        }
      });
      setFieldValue("detail", updateDetail);
    }
  };

  return (
    <Fragment>
      {error && <AlertMessage message={error.message} type="warning" />}
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={300} />
      ) : (
        <Card sx={{ p: 3 }}>
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="stretch"
          >
            {data.ballotByLevel.map((item: any, index: number) => {
              const flag =
                item.political_alliance.political_alliance_image ||
                item.movimiento_interno.movimiento_interno_image ||
                "";
              const photo = item.candidate_image || item.candidate_falg || "";
              const name =
                item.candidate_name ||
                item.political_alliance.political_alliance_code ||
                item.movimiento_interno.movimiento_interno_code ||
                toSafeString(item.candidate_box) ||
                "";
              const detailItemIndex = values.detail.findIndex(
                (deta) => deta.candidate_id === item.candidate_id
              );
              let vote: number | undefined;
              if (detailItemIndex >= 0) {
                vote = values.detail[detailItemIndex]?.votes;
              }

              return (
                <Grid key={`grid-item-${item.candidate_id}`} size={12}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid size={1}>
                      <Typography>{index + 1}</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Grid container size="grow" direction="row" spacing={1}>
                        <Avatar
                          sx={{ objectFit: "scale-down" }}
                          src={flag}
                          variant="square"
                          alt={`${item.candidate_box}`}
                        />
                        <Avatar
                          sx={{ objectFit: "scale-down" }}
                          src={photo}
                          variant="square"
                          alt={`${item.candidate_box}`}
                        />
                      </Grid>
                    </Grid>
                    <Grid size={5}>
                      <Typography>{name}</Typography>
                    </Grid>
                    <Grid size={2}>
                      <TextField
                        fullWidth
                        placeholder="0"
                        label=""
                        defaultValue={vote}
                        onChange={(event) => {
                          handleChangeVotes(
                            event.target.value,
                            item.candidate_id
                          );
                        }}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          type: "number",
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}

            <Grid size="grow">
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Grid size={5}></Grid>
                <Grid size={4}>
                  <Typography>(+) Votos en Blanco</Typography>
                </Grid>
                <Grid size={3}>
                  <TextField
                    fullWidth
                    placeholder="0"
                    label=""
                    {...getFieldProps("blank_votes")}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      type: "number",
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid size={12}>
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Grid size={5}></Grid>
                <Grid size={4}>
                  <Typography>(+) Votos en Nulo</Typography>
                </Grid>
                <Grid size={3}>
                  <TextField
                    fullWidth
                    placeholder="0"
                    label=""
                    {...getFieldProps("void_votes")}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      type: "number",
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid size="grow">
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Grid size={5}></Grid>
                <Grid size={4}>
                  <Typography>Gran Total</Typography>
                </Grid>
                <Grid size={3}>
                  <TextField
                    fullWidth
                    placeholder="0"
                    label=""
                    {...getFieldProps("total_votes")}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      type: "number",
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid size={12}>
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Grid size={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        {...getFieldProps("with_problems")}
                        checked={values.with_problems}
                      />
                    }
                    label="¿Esta acta tiene problemas?"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid size={8}>
                  <TextField
                    fullWidth
                    placeholder="Observaciones"
                    multiline
                    label="Observaciones"
                    {...getFieldProps("observations")}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      )}
    </Fragment>
  );
};

export default Mayor;
