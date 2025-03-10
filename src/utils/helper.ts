import { useLocation } from "react-router-dom";
import { replace } from "lodash";
import numeral from "numeral";
import { v4 as uuidv4 } from "uuid";

import { LANG_FALLBACK, LS_LANG_KEY, LS_TOKEN_KEY } from "./constants";

export const useQueryParams = () => new URLSearchParams(useLocation().search);

export const generateV4Id = (): string => {
  return uuidv4();
};

export const toSafeString = (value: any): string => {
  if (value === undefined) return "";
  if (value === null) return "";

  return `${value}`;
};

export const toSafeNumber = (value: any): number => {
  if (value === undefined) return 0;
  if (value === null) return 0;
  if (value === "") return 0;

  return +`${value}`;
};

export const truncateString = (str: string, length: number): string => {
  if (str.length <= length) return str;

  return `${str.substring(0, length)}...`;
};

export const Translate_Electoral_Level = (level: string): string => {
  switch (level?.toUpperCase()) {
    case "PRESIDENT":
      return "PRESIDENTE";
    case "MAYOR":
      return "ALCALDE";
    case "CONGRESS":
      return "CONGRESO";
    default:
      return "";
  }
};

export function getErrorFromGQL(error: any): string {
  return (error?.message || "")
    .replace("GraphQL error:", "")
    .replace("Network error:", "")
    .replace("Received status code 400", "");
}

export function getAccessToken(): string {
  return window.localStorage.getItem(LS_TOKEN_KEY) || "";
}

export const GetLangInUse = () => {
  const lang = localStorage.getItem(LS_LANG_KEY);
  return lang || LANG_FALLBACK;
};

export function isValidUrl(url: string) {
  // eslint-disable-next-line no-useless-escape
  return url.match(
    /^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i
  );
}

export function isValidUUID(str: string) {
  // eslint-disable-next-line no-useless-escape
  return (
    str.length === 36 &&
    str.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  );
}

export function isValidEmail(email: string) {
  return email.match(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
}

export function isValidPhoneNumber(phone: string) {
  //International phone number (e.g. +1-123-456-7890)
  if (phone.match(/^\+?[0-9]{1,3}\s?\(?[0-9]{3}\)?\s?[0-9]{3}\s?[0-9]{4}$/))
    return true;

  //US phone number (e.g. 123-456-7890)
  return phone.match(/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/);
}

// ISO 3166-1 alpha-2
export function countryToFlag(isoCode: string) {
  return typeof String.fromCodePoint !== "undefined"
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(char.charCodeAt(0) + 127397)
        )
    : isoCode;
}

// ------------------ FORMATS -------------------

export function fCurrency(number: string | number) {
  return numeral(number).format(Number.isInteger(number) ? "$0,0" : "$0,0.00");
}

export function fPercent(number: number) {
  return numeral(number / 100).format("0.0%");
}

export function fNumber(number: string | number) {
  return numeral(number).format();
}

export function fMiles(number: string | number) {
  return numeral(number).format("0,0");
}

export function fShortenNumber(number: string | number) {
  return replace(numeral(number).format("0.00a"), ".00", "");
}

export function fData(number: string | number) {
  return numeral(number).format("0.0 b");
}

export function fISODate(date: string | Date) {
  return new Date(date).toISOString().slice(0, 10);
}
