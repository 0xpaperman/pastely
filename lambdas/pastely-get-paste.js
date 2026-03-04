import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
};

export const handler = async (event) => {
  const { id } = event.pathParameters;

  const result = await db.send(new GetCommand({
    TableName: "pastes",
    Key: { id }
  }));

  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Paste not found" })
    };
  }

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(result.Item)
  };
};
