import { DynamoDB } from 'aws-sdk';
import createError from 'http-errors';

const dynamoDB = new DynamoDB.DocumentClient();

async function updateNote(event: any) {
  if (!event.pathParameters?.id) {
    throw new createError.BadRequest('parameter ID must be provided');
  }

  if (!event.body) {
    throw new createError.BadRequest('Event body must be provided');
  }

  const data: any = JSON.parse(event.body);
  const updatedDate: string = new Date().toISOString();

  const params: DynamoDB.DocumentClient.Update = {
    TableName: process.env.NOTES_API_TABLE_NAME as string,
    Key: {
      noteId: event.pathParameters.id,
    },
    UpdateExpression: 'SET content = :content, updatedDate = :updatedDate',
    ExpressionAttributeValues: {
      ':content': data.content || '',
      ':updatedDate': updatedDate || '',
    },
    ReturnValuesOnConditionCheckFailure: 'ALL_NEW',
  };

  try {
    await dynamoDB.update(params).promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'success update' }),
  };
}

export const handler = updateNote;
