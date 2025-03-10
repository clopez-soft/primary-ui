//import dotenv from "dotenv";
// dotenv.config();

export const appConfig = {
  APP_NAME: import.meta.env.REACT_APP_WEBSITE_NAME || "Conteo Yoro",
  APP_VERSION: import.meta.env.REACT_APP_VERSION || "0.1.1",
  APP_ID: import.meta.env.REACT_APP_APP_ID || "com.electoral.count",
  PUBLIC_URL:
    import.meta.env.PUBLIC_URL ||
    "https://conteoyoro-hgb3c.ondigitalocean.app/",
  ENVIROMENT: import.meta.env.NODE_ENV || "development",
  PORT: import.meta.env.REACT_APP_PORT || 3050,
  GRAPHQL_URL:
    import.meta.env.REACT_APP_GRAPHQL_URL ||
    "https://primary-count-yoro-api-zzqjk.ondigitalocean.app/graphql",
};
