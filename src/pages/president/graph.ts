import { gql } from "@apollo/client";

export const PRESIDENT_RESULT = gql`
  query PresidentResults {
    presidentResults {
      count_record
      total_votes
      president_votes {
        movimiento_interno_id
        movimiento_interno_code
        movimiento_interno_image
        political_alliance_id
        political_alliance_code
        political_alliance_image
        candidate_id
        number_box
        candidate_name
        candidate_image
        candidate_flag
        votes
      }
    }
  }
`;
