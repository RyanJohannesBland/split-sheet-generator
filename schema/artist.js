import * as yup from "yup";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export default yup.object().shape({
  id: yup.string().email("Invalid email").required(), // This is actually the email.
  artistName: yup.string().required(),
  instagram: yup
    .string()
    .default(null)
    .nullable()
    .test(
      "Must start with @",
      "Must start with @",
      (val) => !val || val?.startsWith("@")
    ),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .default(null)
    .nullable(),
  oneStop: yup.boolean().default(null).nullable(),
  publisherIPI: yup.number().default(null).nullable(),
  publisherName: yup.string().default(null).nullable(),
  publisherPRO: yup.string().default(null).nullable(),
  writerIPI: yup.number().default(null).nullable(),
  writerName: yup.string().default(null).nullable(),
  writerPRO: yup.string().default(null).nullable(),
});
