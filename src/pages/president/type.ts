export type PresidentVotes = {
  movimiento_interno_id: string;
  movimiento_interno_code: string;
  movimiento_interno_image: string;

  political_alliance_id: string;
  political_alliance_code: string;
  political_alliance_image: string;

  candidate_id: string;
  candidate_name: string;
  candidate_image: string;
  candidate_flag: string;

  votes: number;
  number_box: number;
};
