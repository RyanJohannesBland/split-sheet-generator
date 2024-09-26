import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import FormikTextField from "@/components/formik/FormikTextField";
import FormikAutocomplete from "@/components/formik/FormikAutocomplete";
import sheetSchema from "@/schema/sheet";

export default function Test() {
  // Load artists on mount.
  const [artists, setArtists] = useState([]);
  useEffect(() => fetchArtists(), []);

  function fetchArtists() {
    fetch("/api/artists", { method: "GET" })
      .then((res) => res.json())
      .then((json) => setArtists(json));
  }

  function createSheet(values) {
    fetch("/api/sheets", { method: "POST", body: JSON.stringify(values) })
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const blob = new Blob([buffer], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${values.songTitle}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ py: 1, display: "flex", gap: 1 }}>
        <Button variant="contained">Previous Sheets</Button>
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
    </Box>
  );
}
