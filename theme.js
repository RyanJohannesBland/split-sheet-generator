"use client";
import { Roboto } from "next/font/google";
import { colors } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    background: {
      default: "#e4f0e2",
    },
    default: {
      main: colors.grey[500],
      lightest: colors.grey[100],
      dark: "rgba(0, 0, 0, 0.87)",
    },
    primary: {
      main: "#040059",
    },
    white: {
      main: "#fff",
    },
  },
});

export default theme;
