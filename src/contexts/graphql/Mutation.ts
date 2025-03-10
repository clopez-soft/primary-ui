import { gql } from '@apollo/client';
import { SESSION_FIELDS, SHOPPING_CART_FIELDS, SITE_SETTINGS_FIELDS } from './Queries';


export const LOGIN = gql`
  mutation Login($loginUserInput: LoginUserInput!) {
    signin: login(loginUserInput: $loginUserInput) {
      ${SESSION_FIELDS()}
    }
  }
`;

export const REGISTER = gql`
  mutation Register($registerUserInput: RegisterUserInput!) {
    signup: register(registerUserInput: $registerUserInput) {
      id
      name
      email
      type
      role {
        id
        code
        name
        access_level
      }
      image_url
    }
  }
`;

export const REGISTER_CONFIRM = gql`
  mutation RegisterConfirmEmail($confirmEmailInput: confirmEmailInput!) {
    registerConfirmEmail: registerConfirmEmail(confirmEmailInput: $confirmEmailInput){
      ${SESSION_FIELDS()}
    }
  }
`;

export const CONNECTO_TO_STORE = gql`
mutation ($input: AdminStoreLoginInput!)
{
  result : connectToStore (input: $input)
  {
    ${SESSION_FIELDS()}
  }
}
`;

export const DISCONNECT_FROM_STORE = gql`
mutation
{
  result : disconnectFromStore
  {
    ${SESSION_FIELDS()}
  }
}
`;

export const LOGOUT = gql`
  mutation Signout {
    signout: logout
  }
`;

export const RESET = gql`
  mutation ResetPassword($resetPasswordInput: resetPasswordInput!) {
    reset: resetPassword(resetPasswordInput: $resetPasswordInput)
  }
`;

export const RESET_CONFIRM = gql`
  mutation ResetPasswordConfirm($resetPasswordConfirmInput: resetPasswordConfirmInput!) {
    resetConfirm: resetPasswordConfirm(resetPasswordConfirmInput: $resetPasswordConfirmInput){
      ${SESSION_FIELDS()}
    }
  }
`;


export const ADD_TO_CART = gql`
mutation ($input : AddToCartInput!)
{
  cart : ec_add_to_shopping_cart(input : $input)
  {
    ${SHOPPING_CART_FIELDS()}
  }
}
`

export const UPDATE_SHOPPING_CART = gql`
mutation ($input : UpdateCartInput!)
{
  cart : ec_update_shopping_cart(input : $input)
  {
    ${SHOPPING_CART_FIELDS()}
  }
}
`

export const REMOVE_FROM_CART = gql`
mutation ($input : RemoveFromCartInput!)
{
  cart : ec_remove_from_shopping_cart(input : $input)
  {
    ${SHOPPING_CART_FIELDS()}
  }
}
`


export const DELETE_CART = gql`
mutation ($id : String!)
{
  result : ec_delete_shopping_cart(id : $id)
}
`

export const UPDATE_MANY_SITE_SETTINGS = gql`
mutation ($input : UpdateManySettingsInput! , $logo : Upload )
{
  result : updateManySiteSettings ( input:$input, logo:$logo)
  {
    ${SITE_SETTINGS_FIELDS()}
  }
}`;