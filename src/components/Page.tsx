import { Helmet } from "react-helmet";
import { forwardRef, ReactNode } from "react";
import { Box, BoxProps } from "@mui/material";

import { appConfig } from "src/config";
interface PageProps extends BoxProps {
  children: ReactNode;
  title?: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, title = "", ...other }, ref) => {
    const app_name: string = "Conteo Electoral Yoro";

    return (
      <Box ref={ref} {...other}>
        <Helmet>
          <title>{`${title} | ${app_name || appConfig.APP_NAME}`}</title>
        </Helmet>
        {children}
      </Box>
    );
  }
);

export default Page;
