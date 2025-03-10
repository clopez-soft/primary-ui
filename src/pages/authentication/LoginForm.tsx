import * as Yup from "yup";
import { useState } from "react";
import { useSnackbar } from "notistack";
//import { Link as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from "formik";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import closeFill from "@iconify/icons-eva/close-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import {
  /*Link,*/ Stack,
  Alert,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { MIconButton } from "src/components/@material-extend";
//import { PATH_AUTH } from 'src/routes/paths';
import useAuth from "src/hooks/useAuth";
import useIsMountedRef from "src/hooks/useIsMountedRef";

type InitialValues = {
  email: string;
  password: string;
  afterSubmit?: string;
};

type Props = {
  onLogged?: () => void;
  forgotPasswordLinkTarget?: string;
};

export default function LoginForm({ onLogged }: Props) {
  const { login } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik<InitialValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        await login(values.email, values.password);

        enqueueSnackbar("Login success", {
          variant: "success",
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          ),
        });

        if (isMountedRef.current) {
          setSubmitting(false);
        }

        if (onLogged) onLogged();

        window.location.reload();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        resetForm();

        if (isMountedRef.current) {
          setSubmitting(false);
          setErrors({ afterSubmit: error?.message || "Login failed" });
        }
      }
    },
  });

  const {
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    submitCount,
  } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && (
            <Alert severity="error">{errors.afterSubmit}</Alert>
          )}

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps("email")}
            InputLabelProps={{ shrink: true }}
            error={Boolean(submitCount > 0 && touched.email && errors.email)}
            helperText={submitCount > 0 && touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            label="Password"
            {...getFieldProps("password")}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(submitCount && touched.password && errors.password)}
            helperText={submitCount > 0 && touched.password && errors.password}
          />
        </Stack>

        {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                    <Link component={RouterLink} target={forgotPasswordLinkTarget || ""} variant="subtitle2" to={PATH_AUTH.resetPassword}>
                        Forgot password?
                    </Link>
                </Stack> */}

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Authenticate
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
