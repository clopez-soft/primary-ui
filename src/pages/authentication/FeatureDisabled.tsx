import { Link as RouterLink } from "react-router-dom";

import { experimentalStyled as styled } from "@mui/material/styles";
import { Card, Link, Container, Typography } from "@mui/material";

import Page from "src/components/Page";
import { MHidden } from "src/components/@material-extend";
import { PATH_AUTH } from "src/routes/paths";

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

type FeatureDisabledProps = {
  title?: string;
  description?: string;
};

export default function FeatureDisabled({
  title,
  description,
}: FeatureDisabledProps) {
  return (
    <RootStyle title={title || "Page disabled"}>
      <MHidden width="mdDown">
        <SectionStyle>
          <img alt="register" src="/static/illustrations/online shopping.svg" />
        </SectionStyle>
      </MHidden>

      <Container>
        <ContentStyle>
          <Typography variant="h5" sx={{ mb: 5 }}>
            {description}
          </Typography>
          <Typography variant="body1" sx={{ mb: 5 }}>
            Available for registered users only.
          </Typography>
          <Typography variant="body1" sx={{ mb: 5 }}>
            Please, contact support for more information.
          </Typography>
          <Typography variant="body1" sx={{ mb: 5 }}>
            Meanwhile, you can try our{" "}
            <Link component={RouterLink} to={PATH_AUTH.login}>
              login
            </Link>{" "}
            page if you already have an account.
          </Typography>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
