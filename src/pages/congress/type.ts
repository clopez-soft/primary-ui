export type CandidateCongress = {
  movimiento_interno_id: string;
  movimiento_interno_code: string;
  movimiento_interno_image: string;
  candidate_id: string;
  number_box: number;
  candidate_name: string;
  candidate_image: string;
  marks: number;
};

export type QuotientParty = {
  movimiento_interno_id: string;
  movimiento_interno_code: string;
  movimiento_interno_image: string;
  marks: number;
  positions: number;
  quotient: number;
  positions_extra: number;
};
