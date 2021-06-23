async function hello(event: any, context: any) {
  console.log(event);
  console.log(context);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from handlers' }),
  };
}

export const handler = hello;
