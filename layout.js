import { AppBar, Box, Button } from "@mui/material";
import { useRouter } from "next/router";

export default function RootLayout({ children }) {
  const router = useRouter();

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          height: 32,
          display: "flex",
          flexDirection: "row",
        }}
        color="white"
      >
        <Button onClick={() => router.push("/artists")}>Artists</Button>
        <Button onClick={() => router.push("/sheets")}>Sheets</Button>
      </AppBar>
      <Box sx={{ margin: 2 }}>{children}</Box>
    </>
  );
}
