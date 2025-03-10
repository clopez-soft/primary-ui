import { Card, Grid, Typography, TextField, Stack } from "@mui/material";

import { RecordFormikProps } from "../type";

type Props = {
  formik: RecordFormikProps;
};

const Ballots = ({ formik }: Props) => {
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
                <Typography>Papeletas Recibidas</Typography>
              </Grid>
              <Grid item xs={3} md={3}>
                <TextField
                  fullWidth
                  placeholder="0"
                  label=""
                  {...getFieldProps("recibed_ballots")}
                  //disabled={fulfillmentLoading}
                  //onChange={debouncedChangeHandler}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: "number",
                  }}
                />
              </Grid>

              <Grid item xs={9} md={9}>
                <Typography>Papeletas Sobrantes</Typography>
              </Grid>
              <Grid item xs={3} md={3}>
                <TextField
                  fullWidth
                  placeholder="0"
                  label=""
                  {...getFieldProps("leftover_ballots")}
                  //disabled={fulfillmentLoading}
                  //onChange={debouncedChangeHandler}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: "number",
                  }}
                />
              </Grid>

              <Grid item xs={9} md={9}>
                <Typography>Papeletas Utilizadas</Typography>
              </Grid>
              <Grid item xs={3} md={3}>
                <TextField
                  fullWidth
                  placeholder="0"
                  label=""
                  {...getFieldProps("total_ballots")}
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

export default Ballots;
