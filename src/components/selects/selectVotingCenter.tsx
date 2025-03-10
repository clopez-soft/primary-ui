/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, gql } from "@apollo/client";
import { FormControl, Skeleton, TextField } from "@mui/material";
import { Autocomplete } from "@mui/lab";
import { FieldInputProps } from "formik";

import AlertMessage from "src/components/AlertMessage";

const QUERY = gql`
  query VotingCenterByMunicipality(
    $municipality_id: String!
    $area: AREA_ELECTORAL_SECTOR
  ) {
    votingCenterByMunicipality(municipality_id: $municipality_id, area: $area) {
      id
      area
      code
      electoral_sector
      name
      electoral_weight
      number_jrv
    }
  }
`;

type Props = {
  municipalityId?: string;
  area?: string;
  value?: any | undefined;
  disabled?: boolean;
  getFieldProps?: FieldInputProps<any>;
  onSelect?: (...args: any[]) => any;
};

type variableType = {
  municipality_id?: string;
  area?: string;
};

const SelectElectoralSector = ({
  municipalityId = "",
  area = undefined,
  value,
  disabled,
  getFieldProps,
  onSelect,
}: Props) => {
  const variables: variableType = {
    municipality_id: municipalityId,
    area: area,
  };
  const { loading, error, data } = useQuery(QUERY, {
    variables: variables,
    fetchPolicy: "cache-first",
  });

  const options =
    data?.votingCenterByMunicipality?.map((option: any) => {
      return {
        value: option.id,
        label: `${option.code} - ${option.electoral_sector}`,
      };
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
          id="select-sector-electoral"
          disabled={disabled}
          value={optionSelected}
          options={[{ value: "", label: "--" } as any].concat(options)}
          style={{ width: "100%" }}
          onChange={(_: any, opt: any) => {
            if (onSelect) {
              const valueSelected = data?.votingCenterByMunicipality?.find(
                (item: any) => item.id === opt?.value
              );
              onSelect(opt?.value || null, valueSelected || null);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              {...getFieldProps}
              fullWidth
              label="Sector Electoral"
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

export default SelectElectoralSector;
