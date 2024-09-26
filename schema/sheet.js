import * as yup from "yup";
import artistSchema from "@/schema/artist";

export default yup.object().shape({
  songTitle: yup.string().required(),
  title: yup.string().required(),
  key: yup.string().required(),
  bpm: yup.string().required(),
  producers: yup.array().of(artistSchema),
  writers: yup.array().of(artistSchema),
});
