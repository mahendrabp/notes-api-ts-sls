import { DynamoDB } from 'aws-sdk';
import createError from 'http-errors';
import { v4 as uuid } from 'uuid';

const dynamoDB = new DynamoDB.DocumentClient();

interface NoteModel {
  userId: string;
  noteId: string;
  content: string;
  createdAt: string;
  updatedDate: string;
}

async function addNote(event: any) {
  if (!event.body) {
    throw new createError.BadRequest('Event body must be provided');
  }

  console.log(event.requestContext.authorizer);

  const { email } = event.requestContext.authorizer;

  const data: any = JSON.parse(event.body);

  const note: NoteModel = {
    userId: email,
    noteId: uuid(),
    content: data.content,
    createdAt: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
  };

  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.NOTES_API_TABLE_NAME as string,
    Item: note,
  };

  try {
    await dynamoDB.put(params).promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(note),
  };
}

export const handler = addNote;
