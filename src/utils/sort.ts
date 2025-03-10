import { filter } from "lodash";
import { toSafeString } from "./helper";

export type Anonymous = Record<string | number, string>;

function descendingComparator(a: Anonymous, b: Anonymous, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(order: "asc" | "desc", orderBy: string) {
  return order === "desc"
    ? (a: Anonymous, b: Anonymous) => descendingComparator(a, b, orderBy)
    : (a: Anonymous, b: Anonymous) => -descendingComparator(a, b, orderBy);
}

export function applySortFilter(
  array: any[] = [],
  fieldName: string,
  comparator: (a: any, b: any) => number,
  query: string
) {
  const stabilizedThis = array.map(
    (el: any, index: any) => [el, index] as const
  );
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  if (query)
    return filter(
      array,
      (item) =>
        toSafeString(item[fieldName])
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1
    );

  return stabilizedThis.map((el) => el[0]);
}

export const SortArrayByProperty = (
  array: any[],
  property: string,
  direction: string = "asc"
) => {
  return array.sort((a, b) => {
    const x = toSafeString(a[property]);
    const y = toSafeString(b[property]);
    return direction === "asc" ? x.localeCompare(y) : y.localeCompare(x);
  });
};

export const SortArray = (array: any[], direction: "asc" | "desc") => {
  return array.sort((a, b) => {
    const x = toSafeString(a);
    const y = toSafeString(b);
    return direction === "asc" ? x.localeCompare(y) : y.localeCompare(x);
  });
};
