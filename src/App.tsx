import Router from "./routes";

// theme
import ThemeConfig from "src/theme";
import GlobalStyles from "src/theme/globalStyles";

import NotistackProvider from "src/components/NotistackProvider";
import LoadingScreen from "src/components/loaders/ellipsis";
import ScrollToTop from "src/components/ScrollToTop";

import useAuth from "src/hooks/useAuth";

function App() {
  const { isInitialized } = useAuth();

  return (
    <ThemeConfig>
      <NotistackProvider>
        <GlobalStyles />
        <ScrollToTop />
        {isInitialized ? <Router /> : <LoadingScreen center={true} />}
      </NotistackProvider>
    </ThemeConfig>
  );
}

export default App;
