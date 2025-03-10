import { Card, Grid, Typography, TextField, Stack } from "@mui/material";

import { RecordFormikProps } from "../type";

type Props = {
  formik: RecordFormikProps;
};

const Votes = ({ formik }: Props) => {
  const { getFieldProps } = formik;

  return (
    <Card sx={{ p: 3, mt: 2 }}>
      <Stack spacing={3}>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
          rowSpacing={1}
        >
          <Grid item xs={12} md={12}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              rowSpacing={1}
            >
              <Grid item xs={9} md={9}>
                <Typography>Votantes</Typography>
              </Grid>
              <Grid item xs={3} md={3}>
                <TextField
                  fullWidth
                  placeholder="0"
                  label=""
                  {...getFieldProps("voters")}
                  //disabled={fulfillmentLoading}
                  //onChange={debouncedChangeHandler}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: "number",
                  }}
                />
              </Grid>

              <Grid item xs={9} md={9}>
                <Typography>Miembros JRV</Typography>
              </Grid>
              <Grid item xs={3} md={3}>
                <TextField
                  fullWidth
                  placeholder="0"
                  label=""
                  {...getFieldProps("jrv_votes")}
                  //disabled={fulfillmentLoading}
                  //onChange={debouncedChangeHandler}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: "number",
                  }}
                />
              </Grid>

              <Grid item xs={9} md={9}>
                <Typography>Custodios y Tecnicos</Typography>
              </Grid>
              <Grid item xs={3} md={3}>
                <TextField
                  fullWidth
                  placeholder="0"
                  label=""
                  {...getFieldProps("custodians")}
                  //disabled={fulfillmentLoading}
                  //onChange={debouncedChangeHandler}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: "number",
                  }}
                />
              </Grid>

              <Grid item xs={9} md={9}>
                <Typography>Total Votantes</Typography>
              </Grid>
              <Grid item xs={3} md={3}>
                <TextField
                  fullWidth
                  placeholder="0"
                  label=""
                  {...getFieldProps("total_voters")}
                  //disabled={fulfillmentLoading}
                  //onChange={debouncedChangeHandler}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: "number",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
};

export default Votes;
