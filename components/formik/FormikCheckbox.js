import { FormControlLabel, Checkbox } from "@mui/material";

export default function FormikTextField({ formikProps, formikKey, label }) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          onChange={(e) => {
            formikProps.setFieldValue(formikKey, e.target.checked);
          }}
          name={formikKey}
          checked={formikProps.values[formikKey] || false}
        />
      }
      label={label}
    />
  );
}
