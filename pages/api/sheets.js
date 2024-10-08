import { PDF } from "@/pdfGeneration/pdf";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

async function createSheet(req, res) {
  const { songTitle, title, key, bpm, producers, writers, ...percentages } =
    JSON.parse(req.body);

  const pdf = new PDF();
  await pdf.downloadTemplate();

  pdf.drawText("title", title);
  pdf.drawText("key", key);
  pdf.drawText("bpm", bpm);

  const producerNames = producers.map((producer) => producer.artistName);
  const writerNames = writers.map((writer) => writer.artistName);
  pdf.drawText("producers", producerNames.join(" & "));
  pdf.drawText("writers", writerNames.join(" & "));

  const contributorMap = [...producers, ...writers].reduce(
    (acc, val) => ({ ...acc, [val.id]: val }),
    {}
  );
  const contributors = Object.values(contributorMap);
  const contributorPercentages = contributors.map((contributor, i) => [
    contributor,
    percentages[contributor.artistName],
  ]);

  const getPercentagesList = (key) =>
    contributorPercentages
      .map(([contributor, percentage]) => `${contributor[key]} ${percentage}%`)
      .join(", ");

  pdf.drawText("writerNamePercentages1", getPercentagesList("writerName"));
  pdf.drawText("writerNamePercentages2", getPercentagesList("writerName"));
  pdf.drawText("publisherNamePercentages", getPercentagesList("publisherName"));
  pdf.drawText("writerNamePercentages3", getPercentagesList("writerName"));

  const writeOwnershipPercentage = (artist, percentage, rowNum) => {
    pdf.drawText(`ownershipWriterName${rowNum + 1}`, artist.writerName);
    pdf.drawText(`ownershipWriterPRO${rowNum + 1}`, artist.writerPRO);
    pdf.drawText(
      `ownershipWriterIPI${rowNum + 1}`,
      artist.writerIPI.toString()
    );
    pdf.drawText(
      `ownershipWriterPercentage${rowNum + 1}`,
      percentage.toString()
    );
    pdf.drawText(`ownershipPublisherName${rowNum + 1}`, artist.publisherName);
    pdf.drawText(`ownershipPublisherPRO${rowNum + 1}`, artist.publisherPRO);
    pdf.drawText(`ownershipPublisherIPI${rowNum + 1}`, artist.publisherIPI);
    pdf.drawText(
      `ownershipPublisherPercentage${rowNum + 1}`,
      percentage.toString()
    );
    pdf.drawText(
      `ownershipMasterPercentage${rowNum + 1}`,
      percentage.toString()
    );
    pdf.drawText(`ownershipArtistEmail${rowNum + 1}`, artist.id);
    pdf.drawText(`ownershipArtistPhone${rowNum + 1}`, artist.phone);
  };

  contributorPercentages.forEach(([artist, percentage], rowNum) =>
    writeOwnershipPercentage(artist, percentage, rowNum)
  );

  pdf.drawText("agree-er1", "Gabriel Joaquin Gutierrez");
  pdf.drawText("agree-er2", "Gabriel Joaquin Gutierrez");

  contributors.forEach((contributor, i) =>
    pdf.drawText(`contributorSignature${i + 1}`, contributor.writerName)
  );

  const arrayBuffer = await pdf.save(songTitle);
  res.status(200).send(arrayBuffer);
}

async function listSheets(req, res) {
  const command = new ListObjectsV2Command({
    Bucket: process.env.BUCKET_NAME,
    Prefix: "sheets/",
  });
  const { Contents } = await s3Client.send(command);

  const pdfFiles = Contents.filter((obj) => obj.Key !== "sheets/").map(
    (obj) => {
      const strippedFileName = obj.Key.replace("sheets/", "").replace(
        ".pdf",
        ""
      );
      return {
        key: obj.Key,
        name: strippedFileName,
        timeCreated: obj.LastModified,
      };
    }
  );
  res.status(200).json(pdfFiles);
}

async function downloadSheet(req, res) {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: req.query.key,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  res.status(200).json({ url });
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (req.query?.key) {
      await downloadSheet(req, res);
    } else {
      await listSheets(req, res);
    }
  }

  if (req.method === "POST") {
    await createSheet(req, res);
  }
}
