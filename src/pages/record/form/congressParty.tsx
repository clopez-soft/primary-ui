import { Grid, Avatar, Typography, TextField } from "@mui/material";
import { RecordFormikProps, RecordDetail } from "../type";

import { toSafeNumber } from "src/utils/helper";

type Props = {
  flag: string;
  candidate_id: string;
  candidate_box: number;
  name: number;
  vote?: number;
  index: number;
  formik: RecordFormikProps;
};

const CongressParty = ({
  flag,
  candidate_id,
  candidate_box,
  name,
  vote,
  index,
  formik,
}: Props) => {
  const { setFieldValue, values } = formik;

  const handleChangeVotes = (vote: string, candidate_id: string) => {
    const detailItemIndex = values.detail.findIndex(
      (item) => item.candidate_id === candidate_id
    );
    if (detailItemIndex >= 0) {
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
    <Grid key={`grid-item-${candidate_id}`} item xs={12} md={12}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <Grid item xs={1} md={1}>
          <Typography>{index + 1}</Typography>
        </Grid>
        <Grid item xs={3} md={3}>
          <Avatar src={flag} variant="square" alt={`${candidate_box}`} />
        </Grid>
        <Grid item xs={5} md={5}>
          <Typography>{name}</Typography>
        </Grid>
        <Grid item xs={3} md={3}>
          <TextField
            fullWidth
            placeholder="0"
            label=""
            defaultValue={vote}
            onChange={(event) => {
              handleChangeVotes(event.target.value, candidate_id);
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
};

export default CongressParty;
