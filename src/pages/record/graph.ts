import { gql } from "@apollo/client";

export const FIELDS = () => `
  id
  name
  number
  electoral_weight
  voting_center{
    id
    area
    code
    electoral_sector
    name
  }
  municipality{
    id
    code
    name
  }
  department{
    id
    code
    name
  }
  country{
    id
    code
  }
`;

export const JRV_BY_NUMBER = gql`
query JrvByNumber($number: Float!,$electoralLevel: ELECTORAL_LEVEL!){
  jrvByNumber(number:$number){
    ${FIELDS()}
  }
  recordByNumberAndLevel(electoralLevel: $electoralLevel, jrv_number:$number){
    id
    level
    jrv{
      id
    }
    number
    electoral_weight
    voters
    jrv_votes
    custodians
    total_voters
    
    valid_votes
    void_votes
    blank_votes
    total_votes
    
    recibed_ballots
    leftover_ballots
    total_ballots
    
    observations
    image_url
    with_problems
    problems
    detail: detail_by_record {
      detail_id
      number_box
      votes
      movimiento_interno{
        movimiento_interno_id
      }
      political_alliance{
        political_alliance_id
      }
      candidate{
        candidate_id
      }
    }
  }
}
`;

export const RECORDS = gql`
  query Records {
    records {
      id
      level
      number
      total_votes
      electoral_weight
      image_url
    }
  }
`;

export const CREATE_RECORD = gql`
  mutation CreateRecord($input: CreateRecordInput!) {
    createRecord(input: $input) {
      id
      level
      number
      image_url
      total_votes
    }
  }
`;

export const UPDATE_RECORD = gql`
  mutation UpdateRecord($input: UpdateRecordInput!) {
    updateRecord(input: $input) {
      id
      level
      number
      image_url
      total_votes
    }
  }
`;

export const GET_BALLOT = gql`
  query BallotByLevel($level: ELECTORAL_LEVEL!, $location_id: String) {
    ballotByLevel(level: $level, location_id: $location_id) {
      candidate_id
      candidate_name
      candidate_box
      candidate_image
      candidate_falg
      movimiento_interno {
        movimiento_interno_id
        movimiento_interno_code
        movimiento_interno_image
      }
      political_alliance {
        political_alliance_id
        political_alliance_code
        political_alliance_image
      }
    }
  }
`;

export const GET_BALLOT_CONGRESS = gql`
  query BallotByCongress {
    ballotByCongress {
      movimiento_interno_id
      movimiento_interno_name
      movimiento_interno_code
      movimiento_interno_image
      sequence
      candidates {
        candidate_id
        candidate_name
        candidate_image
        candidate_box
      }
    }
  }
`;
