import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";
import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
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

function drawText(page, text, params) {
  if (typeof text === "number") {
    text = text.toString();
  } else if (text === null) {
    text = "N/A";
  }

  page.drawText(text, params);
}

async function createSheet(req, res) {
  const { songTitle, title, key, bpm, producers, writers, ...percentages } =
    JSON.parse(req.body);

  const pdfData = await fs.readFile("./pdfs/base_sheet.pdf");
  const pdfDoc = await PDFDocument.load(pdfData);

  const [firstPage, secondPage, thirdPage] = pdfDoc.getPages();

  // Title line.
  drawText(firstPage, title, {
    x: 130,
    y: 660,
    size: 12,
  });
  drawText(firstPage, key, {
    x: 395,
    y: 660,
    size: 12,
  });
  drawText(firstPage, bpm, {
    x: 485,
    y: 660,
    size: 12,
  });

  // Producers and writers.
  const producersText = producers
    .map((producer) => producer.artistName)
    .join(" & ");
  drawText(firstPage, producersText, {
    x: 132,
    y: 640,
    size: 12,
  });

  const writersText = writers.map((writer) => writer.artistName).join(" & ");
  drawText(firstPage, writersText, {
    x: 115,
    y: 620,
    size: 12,
  });

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
  drawText(firstPage, getPercentagesList("writerName"), {
    x: 75,
    y: 532,
    size: 10,
  });
  drawText(firstPage, getPercentagesList("writerName"), {
    x: 182,
    y: 515,
    size: 10,
  });
  drawText(firstPage, getPercentagesList("publisherName"), {
    x: 178,
    y: 495,
    size: 8,
  });
  drawText(firstPage, getPercentagesList("writerName"), {
    x: 75,
    y: 457,
    size: 10,
  });

  const writeOwnershipPercentage = (
    artist,
    percentage,
    rowNum,
    useSecondPage = false
  ) => {
    drawText(useSecondPage ? secondPage : firstPage, artist.writerName, {
      x: 110,
      y: 360 - rowNum * 155 + useSecondPage * 330,
      size: 10,
    });
    drawText(useSecondPage ? secondPage : firstPage, artist.writerPRO, {
      x: 130,
      y: 340 - rowNum * 155 + useSecondPage * 330,
      size: 10,
    });
    drawText(
      useSecondPage ? secondPage : firstPage,
      artist.writerIPI.toString(),
      {
        x: 100,
        y: 320 - rowNum * 155 + useSecondPage * 330,
        size: 10,
      }
    );
    drawText(useSecondPage ? secondPage : firstPage, percentage.toString(), {
      x: 170,
      y: 300 - rowNum * 155 + useSecondPage * 330,
      size: 10,
    });

    drawText(useSecondPage ? secondPage : firstPage, artist.publisherName, {
      x: 370,
      y: 360 - rowNum * 155 + useSecondPage * 330,
      size: 10,
    });
    drawText(useSecondPage ? secondPage : firstPage, artist.publisherPRO, {
      x: 390,
      y: 340 - rowNum * 155 + useSecondPage * 330,
      size: 10,
    });
    drawText(
      useSecondPage ? secondPage : firstPage,
      artist.publisherIPI.toString(),
      {
        x: 360,
        y: 320 - rowNum * 155 + useSecondPage * 330,
        size: 10,
      }
    );
    drawText(useSecondPage ? secondPage : firstPage, percentage.toString(), {
      x: 440,
      y: 300 - rowNum * 155 + useSecondPage * 330,
      size: 10,
    });

    drawText(useSecondPage ? secondPage : firstPage, percentage.toString(), {
      x: 340,
      y: 282 - rowNum * 155 + useSecondPage * 330,
      size: 10,
    });

    drawText(useSecondPage ? secondPage : firstPage, artist.id, {
      x: 132,
      y: 263 - rowNum * 155 + useSecondPage * 330,
      size: 10,
    });
    drawText(useSecondPage ? secondPage : firstPage, artist.phone, {
      x: 343,
      y: 263 - rowNum * 155 + useSecondPage * 330,
      size: 10,
    });
  };

  contributorPercentages
    .slice(0, 2)
    .forEach(([artist, percentage], rowNum) =>
      writeOwnershipPercentage(artist, percentage, rowNum)
    );

  contributorPercentages
    .slice(2)
    .forEach(([artist, percentage], rowNum) =>
      writeOwnershipPercentage(artist, percentage, rowNum, true)
    );

  var agreementText = "";
  for (let index in contributors) {
    const contributorName = contributors[index].writerName;
    const contributorNameSections = contributorName.split(" ");
    for (let contributorNameSection of contributorNameSections) {
      const currentLength = agreementText.split("\n").at(-1).length;
      if (currentLength + contributorNameSection.length > 36) {
        agreementText += "\n";
      }
      agreementText += " " + contributorNameSection;
    }
    if (index < contributors.length - 1) {
      agreementText += ", ";
    }
  }
  const numRows = agreementText.split("\n").length;

  drawText(secondPage, agreementText, {
    x: 338,
    y: 355 + 8 * numRows,
    size: 6,
    lineHeight: 8,
  });
  drawText(secondPage, agreementText, {
    x: 120,
    y: 308 + 8 * numRows,
    size: 6,
    lineHeight: 8,
  });

  contributors.forEach((contributor, contributorNum) =>
    drawText(thirdPage, contributor.writerName, {
      x: 80,
      y: 678 - 58 * contributorNum,
      size: 14,
    })
  );

  const pdfBytes = await pdfDoc.save();
  const arrayBuffer = Buffer.from(pdfBytes);

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: `${songTitle}_${new Date().toISOString()}.pdf`,
    Body: pdfBytes,
  });
  await s3Client.send(command);

  res.status(200).send(arrayBuffer);
}

async function listSheets(req, res) {
  const command = new ListObjectsV2Command({
    Bucket: process.env.BUCKET_NAME,
  });
  const { Contents } = await s3Client.send(command);
  const pdfFiles = Contents.map((obj) => {
    const strippedFileName = obj.Key.replace(".pdf", "");
    const [name, timeCreated] = strippedFileName.split("_");
    return {
      key: obj.Key,
      name,
      timeCreated,
    };
  });
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
