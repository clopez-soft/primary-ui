import { Icon } from "@iconify/react";
import searchFill from "@iconify/icons-eva/search-fill";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
// import settingsIcon from '@iconify/icons-eva/settings-2-fill';
import { styled } from "@mui/material/styles";

import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": { width: 320, boxShadow: theme.customShadows.z8 },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

type UserListToolbarProps = {
  numSelected: number;
  filterName: string;
  placeholder: string;
  showSearch?: boolean;
  showFilter?: boolean;
  onFilterName: (value: string) => void;
};

export default function UserListToolbar({
  filterName,
  placeholder,
  showSearch = true,
  showFilter = true,
  onFilterName,
}: UserListToolbarProps) {
  return (
    <RootStyle>
      {showSearch && (
        <SearchStyle
          value={filterName}
          onChange={(e) => onFilterName(e.target.value)}
          placeholder={placeholder}
          startAdornment={
            <InputAdornment position="start">
              <Box
                component={Icon}
                icon={searchFill}
                sx={{ color: "text.disabled" }}
              />
            </InputAdornment>
          }
        />
      )}
      {showFilter && (
        <Tooltip title="Filtrar lista">
          <IconButton>
            <Icon icon={roundFilterList} />
          </IconButton>
        </Tooltip>
      )}
    </RootStyle>
  );
}
