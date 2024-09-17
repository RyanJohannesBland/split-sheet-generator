import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import {
  Box,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Paper,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArtistDialog from "@/components/ArtistDialog";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default function Test() {
  const [search, setSearch] = useState("");
  const [artists, setArtists] = useState([]);

  const [artistDialogOpen, setArtistDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState({});

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
      .then(() => closeArtistDialog());
  }

  function editArtist(values) {
    fetch("/api/artists", {
      method: "PUT",
      body: JSON.stringify(values),
    })
      .then(() => fetchArtists())
      .then(() => closeArtistDialog());
  }

  function deleteArtist() {
    fetch("/api/artists", {
      method: "DELETE",
      body: JSON.stringify({ email: selectedArtist.id }),
    })
      .then(() => fetchArtists())
      .then(() => setConfirmDeleteOpen(false));
  }

  function filteredArtists() {
    if (!search) return artists;
    const fuse = new Fuse(artists, {
      threshold: 0.5,
      keys: ["artistName", "writerName", "id"],
    });
    const items = fuse.search(search);
    return items.map((item) => item.item);
  }

  function openDeleteDialog(artist) {
    setSelectedArtist(artist);
    setConfirmDeleteOpen(true);
  }

  function openEditDialog(artist) {
    setSelectedArtist(artist);
    setArtistDialogOpen(true);
  }

  function closeDeleteDialog() {
    setSelectedArtist({});
    setConfirmDeleteOpen(false);
  }

  function closeArtistDialog() {
    setSelectedArtist({});
    setArtistDialogOpen(false);
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
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
          <Card sx={{ marginTop: 1 }} key={artist.id}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="h4">
                    {artist.artistName} - {artist.writerName}
                  </Typography>
                  <Typography variant="subtitle1">
                    {artist.id} | {artist.instagram} | {artist.phone}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignContent: "center",
                  }}
                >
                  <IconButton
                    color="error"
                    onClick={() => openDeleteDialog(artist)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="warning"
                    onClick={() => openEditDialog(artist)}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <ArtistDialog
        open={artistDialogOpen}
        artist={selectedArtist}
        close={closeArtistDialog}
        submit={selectedArtist.id ? editArtist : createArtist}
      />

      <ConfirmationDialog
        title="Delete Artist?"
        text={`Are you sure you want to delete artist ${selectedArtist.id}?`}
        open={confirmDeleteOpen}
        cancel={closeDeleteDialog}
        confirm={deleteArtist}
      />
    </Box>
  );
}
