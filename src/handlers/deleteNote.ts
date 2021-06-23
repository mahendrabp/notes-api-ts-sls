import { DynamoDB } from 'aws-sdk';
import createError from 'http-errors';

const dynamoDB = new DynamoDB.DocumentClient();

async function deleteNote(event: any) {
  if (!event.pathParameters?.id) {
    throw new createError.BadRequest('parameter ID must be provided');
  }

  const params: DynamoDB.DocumentClient.Delete = {
    TableName: process.env.NOTES_API_TABLE_NAME as string,
    Key: {
      noteId: event.pathParameters.id,
    },
  };

  try {
    await dynamoDB.delete(params).promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'success delete' }),
  };
}

export const handler = deleteNote;
