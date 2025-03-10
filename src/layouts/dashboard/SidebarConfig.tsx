// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// components
import SvgIconStyle from "src/components/SvgIconStyle";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PieChartIcon from "@mui/icons-material/PieChart";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
//import VerifiedIcon from '@mui/icons-material/Verified';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle
    src={`/static/icons/navbar/${name}.svg`}
    sx={{ width: "100%", height: "100%" }}
  />
);

const ICONS = {
  blog: getIcon("ic_blog"),
  cart: getIcon("ic_cart"),
  chat: getIcon("ic_chat"),
  mail: getIcon("ic_mail"),
  user: getIcon("ic_user"),
  kanban: getIcon("ic_kanban"),
  banking: getIcon("ic_banking"),
  calendar: getIcon("ic_calendar"),
  ecommerce: getIcon("ic_ecommerce"),
  analytics: getIcon("ic_analytics"),
  dashboard: getIcon("ic_dashboard"),
  booking: getIcon("ic_booking"),
};

const sidebarConfig = [
  {
    subheader: "Resultados",
    items: [
      {
        title: "Resumen",
        permission: "dashboard",
        path: PATH_DASHBOARD.root,
        icon: ICONS.dashboard,
        target: "",
      },
      {
        title: "Presidencial",
        permission: "result-president",
        path: PATH_DASHBOARD.results.resultPresident,
        icon: ICONS.analytics,
        target: "",
      },
      {
        title: "Alcaldias",
        permission: "result-mayor",
        path: PATH_DASHBOARD.results.resultMayor,
        icon: <AccountBalanceIcon />,
        target: "",
      },
      {
        title: "Diputados",
        permission: "result-congress",
        path: PATH_DASHBOARD.results.resultCongress,
        icon: <PieChartIcon />,
        target: "",
      },
    ],
  },
  {
    subheader: "Registos",
    items: [
      {
        title: "Actas",
        permission: "record",
        path: PATH_DASHBOARD.records,
        icon: <DocumentScannerIcon />,
        target: "",
      },
      // { title: 'Auditar', permission: 'audit', path: PATH_DASHBOARD.register.registerAudit, icon: <VerifiedIcon />, target: '' },
    ],
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSidebarConfigAuth = (permissions: any) => {
  const menu = sidebarConfig.map((sb) => {
    const childrenAccess = sb.items.filter((i) => {
      const hasAccess =
        permissions?.menu?.some(
          (p: { name: string }) => p?.name === i.permission
        ) || false;

      return hasAccess;
    });

    return {
      ...sb,
      items: childrenAccess,
      granted: childrenAccess.length > 0,
    };
  });

  const granted = menu.filter((m) => m.granted === true);

  return granted;
};
