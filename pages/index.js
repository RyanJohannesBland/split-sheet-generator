import { Button, Card, CardContent, Typography } from "@mui/material";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();
  return (
    <Card>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h4">Welcome to Sheet Generator</Typography>
        <Typography variant="p">
          To edit your existing saved artists, select the artists button below.
          To Create a new PDF sheet or view previously created PDF sheets, click
          the sheets button below.
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => router.push("/artists")}
        >
          Artists
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/sheets")}
        >
          Sheets
        </Button>
      </CardContent>
    </Card>
  );
}
