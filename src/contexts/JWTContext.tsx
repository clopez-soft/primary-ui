import { createContext, ReactNode, useReducer } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { isValidToken, setSession } from "../utils/jwt";
import { getAccessToken, getErrorFromGQL } from "../utils/helper";
import {
  ActionMap,
  AuthState,
  AuthenticatedUser,
  JWTContextType,
  UserPermission,
} from "../@types/authentication";

import {
  LOGIN,
  REGISTER,
  REGISTER_CONFIRM,
  LOGOUT,
  RESET,
  RESET_CONFIRM,
} from "./graphql/Mutation";
import { SESSION } from "./graphql/Queries";

enum Types {
  Initial = "INITIALIZE",
  Login = "LOGIN",
  Logout = "LOGOUT",
  Register = "REGISTER",
  Confirm = "CONFIRM",
  Reset = "RESET",
  ResetConfirm = "RESETCONFIRM",
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthenticatedUser;
    permissions: UserPermission;
  };
  [Types.Login]: {
    user: AuthenticatedUser;
    permissions: UserPermission;
  };
  [Types.Logout]: undefined;
  [Types.Register]: undefined;
  [Types.Confirm]: {
    user: AuthenticatedUser;
    permissions: UserPermission;
  };
  [Types.Reset]: undefined;
  [Types.ResetConfirm]: {
    user: AuthenticatedUser;
    permissions: UserPermission;
  };
};

export type JWTActions =
  ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  permissions: null,
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case "INITIALIZE":
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
        permissions: action.payload.permissions,
      };
    case "LOGIN":
    case "CONFIRM":
    case "RESETCONFIRM":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        permissions: action.payload.permissions,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        permissions: null,
      };

    case "REGISTER":
    case "RESET":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        permissions: null,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  const [signin] = useMutation(LOGIN);
  const [signup] = useMutation(REGISTER);
  const [registerConfirmEmail] = useMutation(REGISTER_CONFIRM);
  const [signout] = useMutation(LOGOUT);
  const [reset] = useMutation(RESET);
  const [resetConfirm] = useMutation(RESET_CONFIRM);

  useQuery(SESSION, {
    fetchPolicy: "cache-first",
    onError: () => {
      dispatch({
        type: Types.Initial,
        payload: {
          isAuthenticated: false,
          user: null,
          permissions: null,
        },
      });
    },
    onCompleted: (data) => {
      try {
        const accessToken = getAccessToken();

        if (
          !isValidToken(accessToken) ||
          !data?.info?.session ||
          !data.info?.permissions
        ) {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null,
              permissions: null,
            },
          });
        }

        const { permissions } = data.info;
        const authUser = AuthenticateUser(data.info);

        if (authUser) {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user: authUser,
              permissions: permissions,
            },
          });
        }
      } catch {
        console.info("error");
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
            permissions: null,
          },
        });
      }
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AuthenticateUser = (loginResponse: any): AuthenticatedUser => {
    if (!loginResponse) return null;

    const { session } = loginResponse;

    if (!session) return null;

    setSession(session?.accessToken);

    const authUser: AuthenticatedUser = {
      id: session.id,
      customer_id: session.customer_id,
      seller_id: session.seller_id,
      email: session.email,
      picture: session.picture,
      role: session.role,
      screen_name: session.screen_name,
      user_type: session.user_type || "",
    };

    return authUser;
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await signin({
        variables: {
          loginUserInput: {
            email,
            password,
          },
        },
      });

      const permissions = response?.data?.signin?.permissions;
      const authUser = AuthenticateUser(response?.data?.signin);

      if (authUser) {
        dispatch({
          type: Types.Login,
          payload: {
            user: authUser,
            permissions: permissions,
          },
        });
      }
    } catch (error) {
      console.error(error);
      const msg = getErrorFromGQL(error);
      throw new Error(msg);
    }
  };

  const register = async (
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    company: string
  ) => {
    try {
      await signup({
        variables: {
          registerUserInput: {
            email,
            password,
            first_name,
            last_name,
            company,
          },
        },
      });

      dispatch({ type: Types.Register });
    } catch (error) {
      const msg = getErrorFromGQL(error);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await signout();
      setSession(null);
      dispatch({ type: Types.Logout });
    } catch (error) {
      const msg = getErrorFromGQL(error);
      throw new Error(msg);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await reset({
        variables: {
          resetPasswordInput: {
            email,
          },
        },
      });
      dispatch({ type: Types.Reset });
    } catch (error) {
      const msg = getErrorFromGQL(error);
      throw new Error(msg);
    }
  };

  const resetPasswordConfirm = async (
    email: string,
    token: string,
    newPassword: string
  ) => {
    try {
      const response = await resetConfirm({
        variables: {
          resetPasswordConfirmInput: {
            email,
            token,
            newPassword,
          },
        },
      });

      const authUser = AuthenticateUser(response?.data?.resetConfirm);
      const { permissions } = response?.data?.resetConfirm ?? {};

      if (authUser) {
        dispatch({
          type: Types.ResetConfirm,
          payload: {
            user: authUser,
            permissions,
          },
        });
      }
    } catch (error) {
      const msg = getErrorFromGQL(error);
      throw new Error(msg);
    }
  };

  const regiterConfirm = async (email: string, token: string) => {
    try {
      const response = await registerConfirmEmail({
        variables: {
          confirmEmailInput: {
            email,
            token,
          },
        },
      });

      const authUser = AuthenticateUser(response?.data?.registerConfirmEmail);
      const { permissions } = response?.data?.registerConfirmEmail ?? {};

      if (authUser) {
        dispatch({
          type: Types.Confirm,
          payload: {
            user: authUser,
            permissions,
          },
        });
      }
    } catch (error) {
      console.error(error);
      const msg = getErrorFromGQL(error);
      throw new Error(msg);
    }
  };

  const updateProfile = () => {};

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        isTeamMember: Boolean(
          state.user && state.user?.user_type?.toUpperCase() === "END_USER"
        ),
        login,
        logout,
        register,
        resetPassword,
        resetPasswordConfirm,
        regiterConfirm,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
