// import { jwtDecode } from "jwt-decode";
// import { verify, sign } from "jsonwebtoken";
import { LS_TOKEN_KEY } from "../utils/constants";

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  //const decoded = jwtDecode<{ exp: number }>(accessToken);
  //const currentTime = Date.now() / 1000;

  //return decoded.exp > currentTime;
  return true;
};

const setSession = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem(LS_TOKEN_KEY, accessToken);
  } else {
    localStorage.removeItem(LS_TOKEN_KEY);
  }
};

export { isValidToken, setSession };
