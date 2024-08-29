import { Formik } from "formik";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import artistSchema from "@/schema/artist";
import FormikTextField from "@/components/formik/FormikTextField";

export default function ArtistDialog({ artist, open, close, submit }) {
  return (
    <Formik
      initialValues={artist || {}}
      validationSchema={artistSchema}
      onSubmit={submit}
    >
      {(formikProps) => (
        <Dialog open={open} onClose={close}>
          <DialogTitle>Create new Artist</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <FormikTextField
                formikProps={formikProps}
                formikKey="artistName"
                label="Artist Name"
              />
              <FormikTextField
                formikProps={formikProps}
                formikKey="writerName"
                label="Writer Name"
              />
              <FormikTextField
                formikProps={formikProps}
                formikKey="id"
                label="Email"
              />
              <FormikTextField
                formikProps={formikProps}
                formikKey="instagram"
                label="Instagram"
              />
              <FormikTextField
                formikProps={formikProps}
                formikKey="phone"
                label="Phone #"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={close}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => formikProps.submitForm()}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
}
