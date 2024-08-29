import { TextField } from "@mui/material";

export default function FormikTextField({ formikProps, formikKey, label }) {
  return (
    <TextField
      id={formikKey}
      name={formikKey}
      label={label || formikKey}
      value={formikProps.values[formikKey] || ""}
      onChange={formikProps.handleChange}
      onBlur={formikProps.handleBlur}
      error={formikProps.touched[formikKey] && !!formikProps.errors[formikKey]}
      helperText={
        formikProps.touched[formikKey] && formikProps.errors[formikKey]
      }
    />
  );
}
