import { DynamoDB } from 'aws-sdk';
import createError from 'http-errors';
import { v4 as uuid } from 'uuid';

const dynamoDB = new DynamoDB.DocumentClient();

interface NoteModel {
  noteId: string;
  content: string;
  createdAt: number;
}

async function addNote(event: any) {
  if (!event.body) {
    throw new createError.BadRequest('Event body must be provided');
  }

  const data: any = JSON.parse(event.body);

  const note: NoteModel = {
    noteId: uuid(),
    content: data.content,
    createdAt: Date.now(),
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
}

export const handler = addNote;
