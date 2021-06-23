import { DynamoDB } from 'aws-sdk';
import createError from 'http-errors';

const dynamoDB = new DynamoDB.DocumentClient();

async function getNote(event: any) {
  if (!event.pathParameters?.id) {
    throw new createError.BadRequest('parameter ID must be provided');
  }

  const params: DynamoDB.DocumentClient.GetItemInput = {
    TableName: process.env.NOTES_API_TABLE_NAME as string,
    Key: {
      noteId: event.pathParameters.id,
    },
  };

  try {
    const note = await dynamoDB.get(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify(note.Item),
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = getNote;
