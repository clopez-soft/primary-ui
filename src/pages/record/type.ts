import { FormikProps } from "formik";

export type MediaRecord = {
  name: string;
  type: string;
  value: File | string;
};

export type VotingCenter = {
  id: string;
  area: string;
  code: string;
  electoral_sector: string;
  name: string;
};

export type Municipality = {
  id: string;
  code: string;
  name: string;
};

export type Department = {
  id: string;
  code: string;
  name: string;
};

export type Country = {
  id: string;
  code: string;
  name: string;
};

export type JrvNumberType = {
  id: string;
  name: string;
  number: number;
  electoral_weight: number;
  voting_center: VotingCenter;
  municipality: Municipality;
  department: Department;
  country: Country;
};

export type RecordManager = {
  id: string;
  jrv_id: string;
  jrv_number: number;
  level: string;
  level_tra: string;
  image_url: string;
  voting_center_id: string;
  total_votes: number;
  electoral_weight: number;
  with_problems: boolean;
};

export type RecordDetail = {
  detail_id: string;
  movimiento_interno_id: string;
  political_alliance_id: string;
  candidate_id: string;
  number_box: number;
  votes?: number;
};

export type Record = {
  id: string;
  level: string;
  jrv_id: string;
  jrv_number: number;
  electoral_weight: number;

  voters: number;
  jrv_votes: number;
  custodians: number;
  total_voters: number;

  recibed_ballots: number;
  total_ballots: number;
  leftover_ballots: number;

  valid_votes: number;
  void_votes: number;
  blank_votes: number;
  total_votes: number;

  observations: string;
  image_url: string;
  detail: RecordDetail[];

  with_problems: boolean;
  problems: string[];
};

export type RecordFormSchema = {
  afterSubmit: string;
  record_id: string;
  level: string;
  jrv_id: string;
  jrv_number?: number;
  electoral_weight: number;

  voters?: number;
  jrv_votes?: number;
  custodians?: number;
  total_voters?: number;

  recibed_ballots?: number;
  leftover_ballots?: number;
  total_ballots?: number;

  valid_votes?: number;
  void_votes?: number;
  blank_votes?: number;
  total_votes?: number;

  observations: string;
  detail: RecordDetail[];
  cover: MediaRecord | null;
  image_url: string;

  with_problems: boolean;
  problems: string[];
};

export type CongressCandidate = {
  candidate_id: string;
  candidate_name: string;
  candidate_image: string;
  candidate_box: number;
};

export type PartyCongress = {
  movimiento_interno_id: string;
  movimiento_interno_code: string;
  movimiento_interno_name: string;
  movimiento_interno_image: string;
  sequence: number;
  candidates: CongressCandidate[];
};

export type RecordFormikProps = FormikProps<RecordFormSchema>;
