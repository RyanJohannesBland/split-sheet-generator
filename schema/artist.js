import * as yup from "yup";

export default yup.object().shape({
  artistName: yup.string().required(),
  writerName: yup.string().required(),
  id: yup.string().email("Invalid email").required(), // This is actually the email.
  instagram: yup
    .string()
    .required()
    .test("Must start with @", "Must start with @", (val) =>
      val.startsWith("@")
    ),
  phone: yup.string().required(),
});
