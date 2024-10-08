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
import FormikCheckBox from "@/components/formik/FormikCheckbox";
import FormikTextField from "@/components/formik/FormikTextField";

export default function ArtistDialog({ artist, open, close, submit }) {
  return (
    <Formik
      initialValues={artist || {}}
      validationSchema={artistSchema}
      onSubmit={submit}
      enableReinitialize
    >
      {(formikProps) => (
        <Dialog open={open} onClose={close}>
          <DialogTitle>Edit Artist</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <FormikTextField
                formikProps={formikProps}
                formikKey="artistName"
                label="Artist Name"
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
              <FormikTextField
                formikProps={formikProps}
                formikKey="writerName"
                label="Writer Name"
              />
              <FormikTextField
                formikProps={formikProps}
                formikKey="writerIPI"
                label="Writer IPI #"
              />
              <FormikTextField
                formikProps={formikProps}
                formikKey="writerPRO"
                label="Writer PRO"
              />
              <FormikTextField
                formikProps={formikProps}
                formikKey="publisherName"
                label="Publisher Name"
              />
              <FormikTextField
                formikProps={formikProps}
                formikKey="publisherIPI"
                label="Publisher IPI #"
              />
              <FormikTextField
                formikProps={formikProps}
                formikKey="publisherPRO"
                label="Publisher PRO #"
              />
              <FormikCheckBox
                formikProps={formikProps}
                formikKey="oneStop"
                label="One Stop?"
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
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
}
