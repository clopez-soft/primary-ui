import { useState, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import useAuth from "src/hooks/useAuth";
import Login from "src/pages/authentication/Login";
import { isValidToken } from "src/utils/jwt";
import { getAccessToken } from "src/utils/helper";

AuthGuard.propTypes = {
  children: PropTypes.node,
};

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(
    null
  );

  if (!isAuthenticated || !isValidToken(getAccessToken())) {
    if (pathname !== requestedLocation) setRequestedLocation(pathname);

    return <Login />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
