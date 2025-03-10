/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
// import { sentenceCase } from "sentence-case";
import * as sentenceCase from "change-case";
import {
  Card,
  Table,
  Stack,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  Theme,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";

import { applySortFilter, getComparator } from "src/utils/sort";
import { toSafeString } from "src/utils/helper";
import { ListHead, ListToolbar, MoreMenu } from "src/components/general";
import Scrollbar from "src/components/Scrollbar";
import LoadingList from "src/components/loaders/loading-list-skeleton";
import Label, { LabelColor } from "src/components/status/Label";
import SearchNotFound from "src/components/SearchNotFound";
import { MoreMenuOption, RouteParams } from "src/components/general/MoreMenu";

export type RenderCellEvent = {
  theme: Theme;
  row: any;
  column: string;
};

export type TableColumn = {
  type:
    | "text"
    | "link"
    | "number"
    | "picture"
    | "status"
    | "app_status"
    | "boolean"
    | "menu";
  pictureVariant?: "circular" | "rounded" | "square";
  pictureAsLink?: boolean;
  id: string;
  label: string;
  align: "center" | "inherit" | "left" | "right" | "justify" | undefined;
  pictureFieldName?: string;
  hidden?: boolean;
  cell_style?: React.CSSProperties;
  onLinkClick?: (row: any) => void;
  renderCell?: (event: RenderCellEvent) => React.ReactNode;
  getStatusColor?: (status: any) => LabelColor;
};

type PageInfo = {
  mode?: "client" | "server";
  rowsPerPage?: number;
  totalRows?: number;
  showPagination?: boolean;
};

type DataTableProps = {
  size?: "small" | "medium";
  stickyHeader?: boolean;
  placeholder: string;
  orderBy: string;
  orderType?: "asc" | "desc";
  filterName: string;
  pagination: PageInfo;
  loader: {
    loading: boolean;
    rows: number;
    columns: number;
  };
  showCheckColumn?: boolean;
  showSearch?: boolean;
  showFilter?: boolean;
  TABLE_HEAD: TableColumn[];
  TABLE_ROWS: any[];
  menuOptions: MoreMenuOption[];
  row_style?: React.CSSProperties;
  tooltipLabel?: string;
  onSearch?: (filterName: string) => void;
  onPageChange?: (page: number) => void;
  onSelectedRowsChange?: (selectedRows: any[]) => void;
};

const getReplacedRouteParams = (
  row: any,
  route: string,
  params?: RouteParams[]
) => {
  if (!row || !params) return route;

  let url = route;
  params?.forEach((p) => {
    if (p.fieldName in row)
      url = url.replace(
        p.paramName,
        toSafeString(row[p.fieldName]).toLowerCase()
      );
  });

  return url;
};

export const DataTable = ({
  loader: { loading, columns: loadingColumns, rows: loadingRows },
  pagination: {
    mode: paginationMode = "client",
    rowsPerPage: rpp = 25,
    totalRows = 0,
    showPagination = true,
  },
  size = "medium",
  stickyHeader = false,
  showCheckColumn = true,
  showSearch = true,
  showFilter = true,
  placeholder,
  orderBy: ob,
  filterName: filterField,
  orderType = "asc",
  TABLE_HEAD,
  TABLE_ROWS,
  menuOptions,
  row_style = {},
  tooltipLabel = "Editar registro",
  onSearch,
  onPageChange,
  onSelectedRowsChange,
}: DataTableProps) => {
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [dataCollection, setDataCollection] = useState<any[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">(orderType);
  const [orderBy, setOrderBy] = useState(ob);
  const [selected, setSelected] = useState<string[]>([]);
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(rpp);

  const isServerMode = paginationMode === "server";

  useEffect(() => {
    setDataCollection(TABLE_ROWS);
  }, [TABLE_ROWS]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = dataCollection.map((n: any) => n.id);
      setSelected(newSelecteds);
      onSelectedRowsChange?.(newSelecteds);
      return;
    }

    setSelected([]);
    onSelectedRowsChange?.([]);
  };

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    onSelectedRowsChange?.(newSelected);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePagechange = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) => {
    if (isServerMode) {
      setPage(page);
      if (onPageChange) onPageChange(page + 1);
    } else {
      setPage(page);
    }
  };

  const handleFilterByName = (filterName: string) => {
    if (isServerMode) {
      setFilterName(filterName);
      if (onSearch) onSearch(filterName);
    } else {
      setFilterName(filterName);
    }
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - dataCollection.length)
      : 0;
  const filteredData = applySortFilter(
    dataCollection,
    filterField,
    getComparator(order, orderBy),
    filterName
  );
  const DataNotFound = filterName.length > 0 && filteredData.length <= 0;

  const dataToRender = isServerMode
    ? filteredData
    : filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card>
      {showSearch || showFilter ? (
        <ListToolbar
          showSearch={showSearch}
          showFilter={showFilter}
          numSelected={selected.length}
          placeholder={placeholder}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />
      ) : (
        <br></br>
      )}

      <Scrollbar>
        {loading ? (
          <LoadingList columns={loadingColumns} rows={loadingRows} />
        ) : (
          <TableContainer sx={{ minWidth: 800 }}>
            <Table size={size} stickyHeader={stickyHeader}>
              <ListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                row_style={row_style}
                rowCount={dataCollection.length}
                numSelected={selected.length}
                showCheckColumn={showCheckColumn}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />

              <TableBody>
                <TableRow style={{ height: 10 }}></TableRow>

                {dataToRender?.map((row) => {
                  const { id } = row;
                  const isItemSelected = selected.indexOf(id) !== -1;

                  return (
                    <TableRow
                      id={`table-row-${id}`}
                      key={`TableRow-${id}`}
                      hover
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                      style={row_style}
                    >
                      {showCheckColumn && (
                        <TableCell
                          key={`TableCell-checkbox`}
                          padding="checkbox"
                        >
                          <Checkbox
                            checked={isItemSelected}
                            onClick={() => handleClick(id)}
                          />
                        </TableCell>
                      )}
                      {TABLE_HEAD.map((c) => {
                        const cellNode = c.renderCell
                          ? c.renderCell({
                              theme: theme,
                              row: row,
                              column: String(c.id),
                            })
                          : null;
                        // const cellNode = c.renderCell ? c.renderCell(theme, row, c.id) : null;
                        const cellStyle = c.cell_style ? c.cell_style : {};

                        if (c.type === "picture")
                          return (
                            <TableCell
                              id={`table-cell-row-${c.id}`}
                              key={`TableCell-${c.id}`}
                              component="th"
                              scope="row"
                              padding="none"
                              style={cellStyle}
                            >
                              {cellNode ? (
                                cellNode
                              ) : (
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <Avatar
                                    variant={c.pictureVariant || "circular"}
                                    alt={row[c.id]}
                                    src={row[c.pictureFieldName || ""]}
                                  />

                                  {c.pictureAsLink ? (
                                    <Tooltip title={tooltipLabel} arrow>
                                      <Typography
                                        variant="subtitle2"
                                        component="a"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          if (c.onLinkClick) c.onLinkClick(row);
                                        }}
                                      >
                                        {row[c.id] || null}
                                      </Typography>
                                    </Tooltip>
                                  ) : (
                                    <Typography variant="subtitle2" noWrap>
                                      {row[c.id] || null}
                                    </Typography>
                                  )}
                                </Stack>
                              )}
                            </TableCell>
                          );

                        if (c.type === "text" || c.type === "number")
                          return cellNode ? (
                            cellNode
                          ) : (
                            <TableCell
                              key={`TableCell-${c.id}`}
                              align={c.align}
                              style={cellStyle}
                            >
                              {row[c.id] || null}
                            </TableCell>
                          );

                        if (c.type === "link") {
                          return (
                            <TableCell
                              key={`TableCell-${c.id}`}
                              align={c.align}
                              style={{ ...cellStyle, cursor: "pointer" }}
                              onClick={() => {
                                if (c.onLinkClick) c.onLinkClick(row);
                              }}
                            >
                              <Tooltip title={tooltipLabel} arrow>
                                <Typography variant="subtitle2" component="a">
                                  {row[c.id] || null}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                          );
                        }

                        if (c.type === "boolean")
                          return (
                            <TableCell
                              key={`TableCell-${c.id}`}
                              align={c.align}
                              style={cellStyle}
                            >
                              {cellNode ? (
                                cellNode
                              ) : (
                                <Checkbox checked={row[c.id] || false} />
                              )}
                            </TableCell>
                          );

                        if (c.type === "app_status") {
                          return (
                            <TableCell
                              key={`TableCell-${c.id}`}
                              align={c.align}
                              style={cellStyle}
                            >
                              {cellNode}
                            </TableCell>
                          );
                        }

                        if (c.type === "status") {
                          const color = c.getStatusColor
                            ? c.getStatusColor(row[c.id])
                            : "default";
                          return cellNode ? (
                            cellNode
                          ) : (
                            <TableCell
                              key={`TableCell-${c.id}`}
                              align={c.align}
                              style={cellStyle}
                            >
                              <Label
                                variant={
                                  theme.palette.mode === "light"
                                    ? "ghost"
                                    : "filled"
                                }
                                color={color}
                              >
                                {sentenceCase.sentenceCase(row[c.id] || null)}
                              </Label>
                            </TableCell>
                          );
                        }

                        return null;
                      })}
                      {menuOptions.length <= 0 ? null : (
                        <TableCell key={`TableCell-menuOptions`} align="right">
                          <MoreMenu
                            displayOptions={menuOptions
                              .filter((m) =>
                                m.evalVisibility
                                  ? m.evalVisibility(row)
                                  : m.visible
                              )
                              .map((m) => {
                                return {
                                  ...m,
                                  route: m.useLink
                                    ? getReplacedRouteParams(
                                        row,
                                        m.route,
                                        m.routeParams
                                      )
                                    : m.route,
                                  onClick: (args) =>
                                    m?.onClick ? m.onClick(args, row) : null,
                                };
                              })}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}

                {!isServerMode && emptyRows > 0 && (
                  <TableRow
                    key={`TableRow-emptyRows`}
                    style={{ height: 53 * emptyRows }}
                  >
                    <TableCell key={`TableCell-colSpan`} colSpan={6}>
                      No hay más registros
                    </TableCell>
                  </TableRow>
                )}

                {DataNotFound && (
                  <TableRow key={`TableRow-filterName`}>
                    <TableCell
                      key={`TableCell-filterName`}
                      align="center"
                      colSpan={6}
                      sx={{ py: 3 }}
                    >
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Scrollbar>

      {showPagination && (
        <TablePagination
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
          labelRowsPerPage={`Registros por página : `}
          rowsPerPageOptions={
            isServerMode ? [rowsPerPage] : [5, 10, 25, 50, 100]
          }
          component="div"
          count={isServerMode ? totalRows : dataCollection.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePagechange}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Card>
  );
};
