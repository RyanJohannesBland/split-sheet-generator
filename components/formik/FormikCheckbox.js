import { FormControlLabel, Checkbox } from "@mui/material";

export default function FormikTextField({ formikProps, formikKey, label }) {
  return (
    <FormControlLabel
      control={<Checkbox checked={formikProps.values.isAdmin} />}
      label={label}
      id={formikKey}
      name={formikKey}
      onChange={formikProps.handleChange}
      onBlur={formikProps.handleBlur}
      error={formikProps.touched[formikKey] && !!formikProps.errors[formikKey]}
      helperText={
        formikProps.touched[formikKey] && formikProps.errors[formikKey]
      }
    />
  );
}
