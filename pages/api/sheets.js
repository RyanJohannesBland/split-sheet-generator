import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs/promises";

function getPercentageList(contributorKey, contributor, percentages) {
  return;
}

async function createSheet(req, res) {
  const {
    title,
    key,
    bpm,
    producers,
    writers,
    percentages: rawPercentages,
  } = JSON.parse(req.body);

  const pdfData = await fs.readFile("./pdfs/base_sheet.pdf");
  const pdfDoc = await PDFDocument.load(pdfData);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Title line.
  firstPage.drawText(title, {
    x: 130,
    y: 660,
    size: 12,
  });
  firstPage.drawText(key, {
    x: 395,
    y: 660,
    size: 12,
  });
  firstPage.drawText(bpm, {
    x: 485,
    y: 660,
    size: 12,
  });

  // Producers and writers.
  const producersText = producers
    .map((producer) => producer.artistName)
    .join(" & ");
  firstPage.drawText(producersText, {
    x: 132,
    y: 640,
    size: 12,
  });

  const writersText = writers.map((writer) => writer.artistName).join(" & ");
  firstPage.drawText(writersText, {
    x: 115,
    y: 620,
    size: 12,
  });

  const contributors = [...new Set([...producers, ...writers])];
  const percentages = rawPercentages.split(",");
  const contributorPercentages = contributors.map((contributor, i) => [
    contributor,
    percentages[i],
  ]);

  const getPercentagesList = (key) =>
    contributorPercentages
      .map(([contributor, percentage]) => `${contributor[key]} ${percentage}%`)
      .join(", ");

  firstPage.drawText(getPercentagesList("writerName"), {
    x: 75,
    y: 532,
    size: 10,
  });

  firstPage.drawText(getPercentagesList("writerName"), {
    x: 182,
    y: 515,
    size: 10,
  });

  firstPage.drawText(getPercentagesList("publisherName"), {
    x: 178,
    y: 495,
    size: 8,
  });

  const pdfBytes = await pdfDoc.save("./test.pdf");
  await fs.writeFile("./pdfs/test.pdf", pdfBytes);

  res.status(200).json({ message: "Success!" });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    await createSheet(req, res);
  }
}
