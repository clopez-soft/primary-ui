import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Container, Button } from "@mui/material";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import useAuth from "src/hooks/useAuth";
import { PATH_DASHBOARD } from "src/routes/paths";
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import AlertMessage from "src/components/AlertMessage";
import { DataTable, TableColumn } from "src/components/table/data-table";

import { toSafeString, Translate_Electoral_Level } from "src/utils/helper";

import { RECORDS } from "./graph";
import { RecordManager } from "./type";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TABLE_HEAD = (onLinkClick: (row: any) => void): TableColumn[] => [
  {
    type: "link",
    align: "left",
    id: "jrv_number",
    label: "# JRV",
    onLinkClick: onLinkClick,
  },
  { type: "text", align: "left", id: "level_tra", label: "Nivel" },
  { type: "number", align: "right", id: "total_votes", label: "Total Votos" },
  {
    type: "number",
    align: "right",
    id: "electoral_weight",
    label: "Carga Electoral",
  },
];

const Records = () => {
  const navigate = useNavigate();
  const { permissions } = useAuth();
  const [recordList, setRecordList] = useState(new Array<RecordManager>());

  const recordPermissions = permissions?.actions?.record;

  const { loading, error } = useQuery(RECORDS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (datos) => {
      if (!datos) return;

      if (!datos.records) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row: RecordManager[] = datos.records.map((row: any) => {
        return {
          id: toSafeString(row.id),
          jrv_id: "",
          jrv_number: +row.number,
          level: toSafeString(row.level),
          level_tra: Translate_Electoral_Level(toSafeString(row.level)),
          image_url: toSafeString(row.image_url),
          voting_center_id: toSafeString(row.voting_center_id),
          total_votes: +row.total_votes,
          electoral_weight: +row.electoral_weight,
        } as RecordManager;
      });

      setRecordList(row);
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLinkClick = (row: any) => {
    if (!row?.level && !row?.jrv_number) return;

    const url = PATH_DASHBOARD.editRecords
      .replace(":number", row.jrv_number)
      .replace(":level", row?.level);
    navigate(url);
  };

  return (
    <Page title="Listado de Actas">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Listado de Actas"
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "List" },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.createRecords}
              startIcon={<Icon icon={plusFill} />}
              disabled={
                !(
                  recordPermissions?.create?.any ||
                  recordPermissions?.create?.own
                )
              }
            >
              Registrar Acta
            </Button>
          }
        />
        {error && (
          <AlertMessage title="Error" message={error.message} type="error" />
        )}
        <DataTable
          placeholder={""}
          orderBy={"jrv_number"}
          filterName={"jrv_number"}
          pagination={{
            mode: undefined,
            rowsPerPage: undefined,
            totalRows: undefined,
            showPagination: undefined,
          }}
          loader={{
            loading: loading,
            rows: 4,
            columns: 5,
          }}
          TABLE_HEAD={TABLE_HEAD(handleLinkClick)}
          TABLE_ROWS={recordList}
          menuOptions={[]}
        />
      </Container>
    </Page>
  );
};

export default Records;
