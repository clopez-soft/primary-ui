/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, gql } from "@apollo/client";
import { FormControl, Skeleton, TextField } from "@mui/material";
import { Autocomplete } from "@mui/lab";
import { FieldInputProps } from "formik";

import AlertMessage from "src/components/AlertMessage";
import { Translate_Electoral_Level } from "src/utils/helper";

const QUERY = gql`
  query ElectoralLevelEnums {
    electoralLevelEnums
  }
`;

type Props = {
  value?: any | undefined;
  disabled?: boolean;
  getFieldProps?: FieldInputProps<any>;
  onSelect?: (...args: any[]) => any;
};

const SelectLevel = ({ value, disabled, getFieldProps, onSelect }: Props) => {
  const { loading, error, data } = useQuery(QUERY, {
    variables: {},
    fetchPolicy: "cache-first",
  });

  const options =
    data?.electoralLevelEnums?.map((option: any) => {
      return { value: option, label: Translate_Electoral_Level(option) };
    }) || [];

  const optionSelected = options.find((item: any) => item.value === value);

  return (
    <FormControl fullWidth>
      {error && (
        <AlertMessage title="Error" message={error.message} type="error" />
      )}
      {loading ? (
        <Skeleton variant="text" width="100%" height={100} />
      ) : (
        <Autocomplete
          id="select-levels"
          disabled={disabled}
          value={value}
          options={[{ value: "", label: "--" } as any].concat(options)}
          style={{ width: "100%" }}
          onChange={(_: any, opt: any) => {
            if (onSelect) {
              onSelect(opt?.value || null);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              {...getFieldProps}
              fullWidth
              label="Nivel Electoral"
              value={Translate_Electoral_Level(optionSelected?.label) || ""}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          )}
        />
      )}
    </FormControl>
  );
};

export default SelectLevel;
