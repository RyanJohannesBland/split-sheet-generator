import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "@/layout";
import theme from "@/theme";

function App({ Component, pageProps }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Component {...pageProps}></Component>
        </Layout>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

export default App;
