import { gql } from '@apollo/client';

export const SESSION_FIELDS = () => `
session 
{
  id
  email
  picture
  screen_name
  user_type
  role  
  accessToken
}
permissions
{
  menu
  actions
}
`

export const SHOPPING_CART_FIELDS = () => `
id
quantity
subtotal
discount
tax    
total
coupons
{
  coupon_id
  amount
  code
  percentage      
  products      
}
products
{
  product_id
  name
  slug
  image_url
  category
  stock  
  variation_id
  quantity
  price
  newest_price
  subtotal
  tax
  total     
}
`
export const SESSION = gql`
query
{
  info : session
  {
    ${SESSION_FIELDS()}
  }
}
`

export const SHOPPING_SESSION = gql`
query ($id: String!)
{
  cart : ec_shopping_cart_session(id : $id)
  {
    ${SHOPPING_CART_FIELDS()}
  }
}
`

export const SITE_SETTINGS_FIELDS = () => `
    setting
    description
    slug
    open
    value_type
    curated
    values
`;

export const SITE_SETTINGS = gql`
query
{
  siteSettings
  {
    ${SITE_SETTINGS_FIELDS()}
  }
}
`;