import { Fragment, useState } from "react";
import { useQuery } from "@apollo/client";
import { Skeleton } from "@mui/material";

import useAuth from "src/hooks/useAuth";
import Page from "src/components/Page";
import AlertMessage from "src/components/AlertMessage";
import { toSafeString, toSafeNumber } from "src/utils/helper";
import FormRecord from "./form";

import { JRV_BY_NUMBER } from "./graph";
import { JrvNumberType, Record, RecordDetail } from "./type";

const initialJrv: JrvNumberType = {
  id: "",
  name: "",
  number: 0,
  electoral_weight: 0,
  voting_center: {
    id: "",
    area: "",
    code: "",
    electoral_sector: "",
    name: "",
  },
  municipality: {
    id: "",
    code: "",
    name: "",
  },
  department: {
    id: "",
    code: "",
    name: "",
  },
  country: {
    id: "",
    code: "",
    name: "",
  },
};

const initialRecord: Record = {
  id: "",
  level: "",
  jrv_id: "",
  jrv_number: 0,
  electoral_weight: 0,

  valid_votes: 0,
  void_votes: 0,
  blank_votes: 0,
  total_votes: 0,

  recibed_ballots: 0,
  leftover_ballots: 0,
  total_ballots: 0,

  observations: "",
  image_url: "",
  detail: [],

  voters: 0,
  jrv_votes: 0,
  custodians: 0,
  total_voters: 0,

  with_problems: false,
  problems: [],
};

const EditRecord = () => {
  const { permissions } = useAuth();
  const recordPermissions = permissions?.actions?.record;

  const jrvNumber = window.location.pathname.split("/")[2];
  const level = window.location.pathname.split("/")[3];

  const [jrv, setJrv] = useState(initialJrv);
  const [record, setRecord] = useState(initialRecord);

  const { loading, error } = useQuery(JRV_BY_NUMBER, {
    variables: { number: +jrvNumber, electoralLevel: level },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      if (!data || data?.jrvByNumber?.length === 0) {
        // some code
      } else {
        setJrv(data?.jrvByNumber[0]);
      }
      if (data && data?.recordByNumberAndLevel) {
        const recordInfo = data?.recordByNumberAndLevel;

        //console.info(recordInfo.detail);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tempDetail: RecordDetail[] = recordInfo.detail.map((det: any) => {
          return {
            detail_id: toSafeString(det.detail_id),
            movimiento_interno_id: toSafeString(
              det.movimiento_interno.movimiento_interno_id
            ),
            political_alliance_id: toSafeString(
              det.political_alliance.political_alliance_id
            ),
            candidate_id: toSafeString(det.candidate.candidate_id),
            number_box: toSafeNumber(det.number_box),
            votes: toSafeNumber(det.votes),
          } as RecordDetail;
        });
        const temp: Record = {
          id: toSafeString(recordInfo.id),
          level: toSafeString(recordInfo.level),
          jrv_id: toSafeString(recordInfo.jrv.id),
          jrv_number: recordInfo.number || 0,
          electoral_weight: recordInfo.electoral_weight || 0,

          valid_votes: recordInfo.valid_votes || 0,
          void_votes: recordInfo.void_votes || 0,
          blank_votes: recordInfo.blank_votes || 0,
          total_votes: recordInfo.total_votes || 0,

          recibed_ballots: recordInfo.recibed_ballots || 0,
          leftover_ballots: recordInfo.leftover_ballots || 0,
          total_ballots: recordInfo.total_ballots || 0,

          observations: toSafeString(recordInfo.observations),
          image_url: toSafeString(recordInfo.image_url),
          detail: tempDetail || [],

          voters: recordInfo.voters || 0,
          jrv_votes: recordInfo.jrv_votes || 0,
          custodians: recordInfo.custodians || 0,
          total_voters: recordInfo.total_voters || 0,

          with_problems: recordInfo.with_problems || false,
          problems: recordInfo.problems || [],
        };
        setRecord(temp);
      }
    },
  });

  const updatePermission = recordPermissions?.update?.any;

  //console.info(jrv);
  return (
    <Page title="Edicion de Actas">
      <Fragment>
        {error && <AlertMessage message={error.message} type="warning" />}
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={300} />
        ) : (
          <FormRecord
            isEdit={true}
            canSave={updatePermission}
            row={record}
            jrvInfo={jrv}
          />
        )}
      </Fragment>
    </Page>
  );
};

export default EditRecord;
