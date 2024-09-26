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
      default: "#AFDDE5", // Pale Blue
    },
    primary: {
      main: "#003135", // Dark Blue
    },
    secondary: {
      main: "#0FA4AF", // Light Blue
    },
    accent: {
      main: "#964734", // Brown
    },
    white: {
      main: "#FFFFFF", // White
    },
  },
});

export default theme;
