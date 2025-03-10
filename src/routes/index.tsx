import { Suspense, lazy } from "react";
import { Navigate, useRoutes, useLocation } from "react-router-dom";

import DashboardLayout from "src/layouts/dashboard";
import LogoOnlyLayout from "src/layouts/LogoOnlyLayout";

import GuestGuard from "src/guards/GuestGuard";
import AuthGuard from "src/guards/AuthGuard";
import LoadingScreen from "src/components/loaders/loadingScreen";
import { ROOTS_PUBLIC } from "./paths";

const Loadable = (Component: any) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes("/resumen");

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: "fixed",
            }),
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "auth",
      children: [
        {
          path: "login",
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: "resumen",
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [{ path: "", element: <Dashboard /> }],
    },
    {
      path: "resultados",
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: "", element: <Dashboard /> },
        { path: "presidente", element: <PresidentResult /> },
        { path: "alcaldes", element: <MayorResult /> },
        { path: "diputados", element: <CongressResult /> },
      ],
    },
    {
      path: "actas",
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: "", element: <Records /> },
        { path: "nueva", element: <CreateRecords /> },
        { path: ":number/:level/edit", element: <EditRecords /> },
      ],
    },
    {
      path: "",
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: "", element: <Dashboard /> },
        { path: "/home", element: <Dashboard /> },
      ],
    },
    {
      path: ROOTS_PUBLIC,
      element: (
        <LogoOnlyLayout
          redirect_to={ROOTS_PUBLIC + "/shop"}
          logo_sx={{
            paddingRight: 0,
            maxWidth: "50px",
          }}
        />
      ),
    },
    {
      path: "*",
      element: (
        <LogoOnlyLayout
          logo_sx={{
            paddingRight: 0,
            maxWidth: "50px",
          }}
        />
      ),
      children: [
        { path: "404", element: <NotFound /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
  ]);
}

// const LockedFeature = () => (
//     <FeatureDisabled title="Page disabled" description="This page is currently disabled" />
// );

// Authentication
const Login = Loadable(lazy(() => import("src/pages/authentication/Login")));
//const FeatureDisabled = Loadable(lazy(() => import('src/pages/authentication/FeatureDisabled')));

// Dashboard
const Dashboard = Loadable(lazy(() => import("src/pages/board/Dashboard")));
const NotFound = Loadable(lazy(() => import("src/pages/misc/Page404")));

// Maintenance
//const NotDefined = Loadable(lazy(() => import('src/pages/misc/NotDefined')));

//Records
const Records = Loadable(lazy(() => import("src/pages/record")));
const CreateRecords = Loadable(
  lazy(() => import("src/pages/record/CreateRecord"))
);
const EditRecords = Loadable(lazy(() => import("src/pages/record/EditRecord")));

//Resultados
const CongressResult = Loadable(lazy(() => import("src/pages/congress/")));
const MayorResult = Loadable(lazy(() => import("src/pages/mayor/")));
const PresidentResult = Loadable(lazy(() => import("src/pages/president/")));
