import { lineSplit, PDFDocument } from "pdf-lib";
import fs from "fs/promises";

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
    if (agreementText.split("\n").at(-1).length + contributorName.length > 26) {
      agreementText += "\n";
    }
    agreementText += contributorName;
    if (index < contributors.length - 1) {
      agreementText += ", ";
    }
  }
  const numRows = agreementText.split("\n").length;

  drawText(secondPage, agreementText, {
    x: 338,
    y: 355 + 8 * numRows,
    size: 8,
    lineHeight: 8,
  });
  drawText(secondPage, agreementText, {
    x: 120,
    y: 308 + 8 * numRows,
    size: 8,
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
  res.status(200).send(arrayBuffer);
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    await createSheet(req, res);
  }
}
