import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
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
    console.log(values);
    fetch("/api/sheets", { method: "POST", body: JSON.stringify(values) });
  }

  return (
    <Box sx={{ p: 2 }}>
      <Button>Previous Sheets</Button>
      <Button>Show Preview</Button>

      <Formik
        initialValues={{}}
        validationSchema={sheetSchema}
        onSubmit={createSheet}
      >
        {(formikProps) => (
          <Card>
            <CardHeader>
              <Typography>Create New Sheet</Typography>
            </CardHeader>
            <CardContent>
              <FormikTextField
                formikProps={formikProps}
                formikKey="title"
                label="Title"
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

              <FormikTextField
                formikProps={formikProps}
                formikKey="percentages"
                label="Please enter percentages in order"
              />
            </CardContent>
            <CardActions>
              <Button onClick={() => formikProps.submitForm()}>
                Generate Sheet
              </Button>
            </CardActions>
          </Card>
        )}
      </Formik>
    </Box>
  );
}
