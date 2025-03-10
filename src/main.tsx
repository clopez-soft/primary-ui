// import "simplebar/src/simplebar.css";
// import "react-image-lightbox/style.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import "lazysizes/plugins/object-fit/ls.object-fit";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
// import "react-checkbox-tree/lib/react-checkbox-tree.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import { Helmet } from "react-helmet";

import ApolloContext from "src/contexts/ApolloContext";
// import { GraphQLProvider } from "src/contexts/GraphQLContext";
import { AuthProvider } from "src/contexts/JWTContext";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloContext>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ApolloContext>
  </StrictMode>
);
