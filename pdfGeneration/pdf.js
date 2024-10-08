import { PDFDocument } from "pdf-lib";
import { getTextLocation } from "@/pdfGeneration/textLocation";
import { getTextFormatting } from "@/pdfGeneration/textFormatting";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

class PDF {
  constructor() {
    this.pdf = null;
    this.pages = null;
    this.s3Client = new S3Client({
      region: process.env.REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    });
  }

  async downloadTemplate() {
    const getCommand = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: "template/base_sheet.pdf",
    });
    const { Body } = await this.s3Client.send(getCommand);
    const pdfData = await Body.transformToByteArray();
    const pdfDoc = await PDFDocument.load(pdfData);
    this.pdf = pdfDoc;
    this.pages = pdfDoc.getPages();
  }

  drawText(section, text) {
    if (typeof text === "number") {
      text = text.toString();
    } else if (text === null) {
      text = "N/A";
    }

    const { text: formattedText, size } = getTextFormatting(section, text);
    const [page, x, y] = getTextLocation(section);

    this.pages[page - 1].drawText(formattedText, {
      x,
      y,
      size,
    });
  }

  async save(songTitle) {
    const pdfBytes = await this.pdf.save();
    const arrayBuffer = Buffer.from(pdfBytes);

    let Key;
    if (process.env.ENVIRONMENT === "local") {
      Key = `testing/${songTitle}.pdf`;
    } else {
      Key = `sheets/${songTitle}.pdf`;
    }

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key,
      Body: pdfBytes,
    });
    await this.s3Client.send(command);

    return arrayBuffer;
  }
}

module.exports = { PDF };
