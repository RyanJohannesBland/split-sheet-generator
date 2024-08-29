import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArtistDialog from "@/components/ArtistDialog";

export default function Test() {
  const [search, setSearch] = useState("");
  const [artists, setArtists] = useState([]);
  const [artistDialogOpen, setArtistDialogOpen] = useState(false);

  // Load artists on mount.
  useEffect(() => fetchArtists(), []);

  function fetchArtists() {
    fetch("/api/artists", { method: "GET" })
      .then((res) => res.json())
      .then((json) => setArtists(json));
  }

  function createArtist(values) {
    fetch("/api/artists", {
      method: "POST",
      body: JSON.stringify(values),
    })
      .then(() => fetchArtists())
      .then(() => closeDialog());
  }

  function editArtist(body) {}

  function deleteArtist(email) {}

  function filteredArtists() {
    return artists;
  }

  function closeDialog() {
    setArtistDialogOpen(false);
  }

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h1">Artists</Typography>

      <Box
        sx={{
          marginY: 1,
          display: "flex",
          alignContent: "center",
          width: "100%",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextField
            label="Search..."
            variant="outlined"
            sx={{ bgcolor: "white.main" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            color="success"
            variant="contained"
            onClick={() => setArtistDialogOpen(true)}
          >
            + Create Artist
          </Button>
        </Box>

        {filteredArtists().map((artist) => (
          <Card sx={{ marginY: 1 }} key={artist.id}>
            <CardContent>
              <Box sx={{}}>
                <Typography variant="h4">
                  {artist.artistName} - {artist.writerName}
                </Typography>
                <Typography variant="subtitle1">
                  {artist.id} | {artist.instagram} | {artist.phone}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <ArtistDialog
        open={artistDialogOpen}
        close={closeDialog}
        submit={createArtist}
      />
    </Paper>
  );
}
