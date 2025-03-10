// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthenticatedUser = {
  id: string;
  customer_id: string;
  seller_id: string;
  email: string;
  picture: string;
  screen_name: string;
  role: string;
  user_type: string;
} | null;

export type DispensaryStore = {
  id: string;
  admin_id: string;
  name: string;
  role: string;
  role_name: string;
  avatar: string;
};

// export type AuthUser = null | AuthenticatedUser;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UserPermission = null | Record<string, any>;

export type AuthState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthenticatedUser;
  permissions: UserPermission;
};

export type JWTContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthenticatedUser;
  permissions: UserPermission;
  method: "jwt";
  isTeamMember: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    company: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  regiterConfirm: (email: string, token: string) => Promise<void>;
  resetPasswordConfirm: (
    email: string,
    token: string,
    newPassword: string
  ) => Promise<void>;
  updateProfile: VoidFunction;
};
