function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = "/auth";
const ROOTS_DASHBOARD = "/resumen";
const ROOTS_RESULTS = "/resultados";
const ROOTS_RECORDS = "/actas";
export const ROOTS_PUBLIC = "/p";

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, "/login"),
  register: path(ROOTS_AUTH, "/register"),
  resetPassword: path(ROOTS_AUTH, "/reset-password"),
  resetPasswordConfirm: path(ROOTS_AUTH, "/reset-password-confirm"),
  verify: path(ROOTS_AUTH, "/verify"),
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  results: {
    resultPresident: path(ROOTS_RESULTS, "/presidente"),
    resultMayor: path(ROOTS_RESULTS, "/alcaldes"),
    resultCongress: path(ROOTS_RESULTS, "/diputados"),
  },
  records: ROOTS_RECORDS,
  createRecords: path(ROOTS_RECORDS, "/nueva"),
  editRecords: path(ROOTS_RECORDS, "/:number/:level/edit"),
};
