/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, gql } from "@apollo/client";
import { FormControl, Skeleton, TextField } from "@mui/material";
import { Autocomplete } from "@mui/lab";
import { FieldInputProps } from "formik";

import AlertMessage from "src/components/AlertMessage";

const QUERY = gql`
  query VotingCenterAreas {
    votingCenterAreas
  }
`;

type Props = {
  value?: any | undefined;
  disabled?: boolean;
  getFieldProps?: FieldInputProps<any>;
  onSelect?: (...args: any[]) => any;
};

const SelectArea = ({ value, disabled, getFieldProps, onSelect }: Props) => {
  const { loading, error, data } = useQuery(QUERY, {
    variables: {},
    fetchPolicy: "cache-first",
  });

  const options =
    data?.votingCenterAreas?.map((option: any) => {
      return { value: option, label: option };
    }) || [];

  const optionSelected = options.find((item: any) => item === value);

  return (
    <FormControl fullWidth>
      {error && (
        <AlertMessage title="Error" message={error.message} type="error" />
      )}
      {loading ? (
        <Skeleton variant="text" width="100%" height={100} />
      ) : (
        <Autocomplete
          id="select-areas"
          disabled={disabled}
          value={optionSelected}
          options={[{ value: "", label: "--" } as any].concat(options)}
          style={{ width: "100%" }}
          onChange={(_, opt: any) => {
            if (onSelect) {
              onSelect(opt?.value || null);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              {...getFieldProps}
              fullWidth
              label="Area"
              value={optionSelected?.label || ""}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          )}
        />
      )}
    </FormControl>
  );
};

export default SelectArea;
