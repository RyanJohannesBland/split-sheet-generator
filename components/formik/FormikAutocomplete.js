import { Autocomplete, TextField } from "@mui/material";

export default function FormikAutocomplete({
  formikProps,
  formikKey,
  label,
  ...props
}) {
  return (
    <Autocomplete
      multiple
      id={formikKey}
      name={formikKey}
      value={formikProps.values[formikKey] || []}
      onChange={(e, value) => {
        formikProps.setFieldValue(formikKey, value);
      }}
      renderInput={(params) => (
        <TextField
          label={label || formikKey}
          name={formikKey}
          error={
            formikProps.touched[formikKey] && !!formikProps.errors[formikKey]
          }
          helperText={
            formikProps.touched[formikKey] && formikProps.errors[formikKey]
          }
          {...params}
        />
      )}
      {...props}
    />
  );
}
