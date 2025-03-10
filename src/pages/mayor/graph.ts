import { gql } from "@apollo/client";

export const MAYOR_RESULT = gql`
  query MayorResults($municipality_id: String!) {
    mayorResults(municipality_id: $municipality_id) {
      count_record
      total_votes
      positions {
        position
        movimiento_interno_id
        movimiento_interno_code
        movimiento_interno_image
      }
      marks {
        movimiento_interno_id
        movimiento_interno_code
        movimiento_interno_image
        totalmark
      }
    }
  }
`;
