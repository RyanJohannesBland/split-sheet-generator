import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { Formik } from "formik";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Typography,
  TextField,
} from "@mui/material";
import FormikTextField from "@/components/formik/FormikTextField";
import FormikAutocomplete from "@/components/formik/FormikAutocomplete";
import sheetSchema from "@/schema/sheet";
import SearchIcon from "@mui/icons-material/Search";

export default function Sheets() {
  const [search, setSearch] = useState("");

  // Load artists on mount.
  const [artists, setArtists] = useState([]);
  useEffect(() => fetchArtists(), []);

  // Load previous sheets on mount.
  const [sheets, setSheets] = useState([]);
  useEffect(() => fetchSheets(), []);

  const [openPreviousSheetsDialog, setOpenPreviousSheetsDialog] =
    useState(false);

  function fetchArtists() {
    fetch("/api/artists", { method: "GET" })
      .then((res) => res.json())
      .then((json) => setArtists(json));
  }

  function fetchSheets() {
    fetch("/api/sheets", { method: "GET" })
      .then((res) => res.json())
      .then((json) => setSheets(json));
  }

  function createSheet(values) {
    fetchAndDownloadPdf(
      "/api/sheets",
      {
        method: "POST",
        body: JSON.stringify(values),
      },
      values.songTitle,
      () => fetchSheets()
    );
  }

  function downloadSheet(key) {
    fetch(`/api/sheets?key=${key}`, { method: "GET" })
      .then((res) => res.json())
      .then((json) =>
        fetchAndDownloadPdf(
          json.url,
          { method: "GET" },
          key.replace(".pdf", "")
        )
      );
  }

  function fetchAndDownloadPdf(url, args, fileName, callback) {
    fetch(url, args)
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const blob = new Blob([buffer], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${fileName}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .then(callback);
  }

  function filteredSheets() {
    if (!search) return sheets;
    const fuse = new Fuse(sheets, {
      threshold: 0.5,
      keys: ["name"],
    });
    const items = fuse.search(search);
    return items.map((item) => item.item);
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ py: 1, display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          onClick={() => setOpenPreviousSheetsDialog(true)}
        >
          Previous Sheets
        </Button>
      </Box>

      <Formik
        initialValues={{}}
        validationSchema={sheetSchema}
        onSubmit={createSheet}
      >
        {(formikProps) => (
          <Card>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="h4">Create New Sheet</Typography>
              <FormikTextField
                formikProps={formikProps}
                formikKey="songTitle"
                label="Sheet Title"
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <FormikTextField
                  formikProps={formikProps}
                  formikKey="title"
                  label="Song Title"
                />
                <FormikTextField
                  formikProps={formikProps}
                  formikKey="key"
                  label="Key"
                />
                <FormikTextField
                  formikProps={formikProps}
                  formikKey="bpm"
                  label="BPM"
                />
              </Box>

              <FormikAutocomplete
                formikProps={formikProps}
                formikKey="producers"
                label="Producers"
                disableCloseOnSelect
                options={artists}
                isOptionEqualToValue={(option, value) =>
                  option.artistName === value.artistName
                }
                getOptionLabel={(option) => option.artistName}
              />

              <FormikAutocomplete
                formikProps={formikProps}
                formikKey="writers"
                label="Writers"
                disableCloseOnSelect
                options={artists}
                isOptionEqualToValue={(option, value) =>
                  option.artistName === value.artistName
                }
                getOptionLabel={(option) => option.artistName}
              />

              <Card
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Typography>Contributor Percentages</Typography>
                {/* Render a textfield for each unique contributor. null protect to prevent
                intermediate value error. */}
                {(formikProps?.values?.writers?.length ||
                  formikProps?.values?.writers?.length) &&
                  [
                    ...new Set([
                      ...formikProps?.values?.writers,
                      ...formikProps?.values?.producers,
                    ]),
                  ].map((contributor) => (
                    <FormikTextField
                      key={contributor.artistName}
                      formikProps={formikProps}
                      formikKey={contributor.artistName}
                      label={`${contributor.artistName} percentage`}
                    />
                  ))}
              </Card>
            </CardContent>
            <CardActions sx={{ justifyContent: "end" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => formikProps.submitForm()}
              >
                Generate Sheet
              </Button>
            </CardActions>
          </Card>
        )}
      </Formik>

      <Dialog
        fullScreen
        open={openPreviousSheetsDialog}
        onClose={() => setOpenPreviousSheetsDialog(false)}
      >
        <DialogTitle>Previously Created Sheet PDFs</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
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
            {filteredSheets().map((sheet) => (
              <Card sx={{ marginTop: 1, width: "100%" }} key={sheet.key}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography>{sheet.name}</Typography>
                    <Typography>
                      {new Date(sheet.timeCreated).toLocaleString()}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => downloadSheet(sheet.key)}
                    >
                      Download
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenPreviousSheetsDialog(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
