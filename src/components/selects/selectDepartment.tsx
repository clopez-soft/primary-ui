/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, gql } from "@apollo/client";
import { FormControl, Skeleton, TextField } from "@mui/material";
import { Autocomplete } from "@mui/lab";
import { FieldInputProps } from "formik";

import AlertMessage from "src/components/AlertMessage";

const QUERY = gql`
  query Departments {
    departments {
      id
      code
      name
    }
  }
`;

type Props = {
  value?: any | undefined;
  disabled?: boolean;
  getFieldProps?: FieldInputProps<any>;
  codeDefault?: string;
  onSelect?: (...args: any[]) => any;
};

const SelectDepartments = ({
  value,
  disabled,
  getFieldProps,
  codeDefault = "18",
  onSelect,
}: Props) => {
  const { loading, error, data } = useQuery(QUERY, {
    variables: {},
    fetchPolicy: "cache-first",
  });

  const defaultDepartment = data?.departments?.find(
    (item: any) => item.code === codeDefault
  );

  const options =
    data?.departments?.map((option: any) => {
      return { value: option.id, label: `${option.code} - ${option.name}` };
    }) || [];

  const optionSelected = options.find((item: any) => item.value === value);
  const defaultOption = options.find(
    (item: any) => item.value === defaultDepartment.id
  );

  return (
    <FormControl fullWidth>
      {error && (
        <AlertMessage title="Error" message={error.message} type="error" />
      )}
      {loading ? (
        <Skeleton variant="text" width="100%" height={100} />
      ) : (
        <Autocomplete
          id="select-departments"
          disabled={disabled}
          value={optionSelected || defaultOption}
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
              label="Departamento"
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

export default SelectDepartments;
