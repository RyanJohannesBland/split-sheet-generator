import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import artistSchema from "@/schema/artist";

const dbClient = new DynamoDBClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(dbClient);

async function getArtists(req, res) {
  const command = new QueryCommand({
    TableName: "split_sheet_generator.V1",
    KeyConditionExpression: "objectType = :objectType",
    ExpressionAttributeValues: {
      ":objectType": "artist",
    },
  });

  const { Items: artists } = await docClient.send(command);

  res.status(200).json(artists);
}

async function createArtist(req, res) {
  const newArtist = JSON.parse(req.body);
  const validatedArtist = await artistSchema.validate(newArtist);

  const command = new PutCommand({
    TableName: "split_sheet_generator.V1",
    Item: {
      objectType: "artist",
      ...validatedArtist,
    },
  });
  const response = await docClient.send(command);

  res.status(200).json({ message: "Success!" });
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    await getArtists(req, res);
  }

  if (req.method === "POST") {
    await createArtist(req, res);
  }
}
