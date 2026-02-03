import { createError } from 'h3';

export default defineEventHandler(async (event: any) => {
  const body = await readBody<{ emailAddress: string; password: string; username: string }>(event);

  const { emailAddress, password, username } = body;

  let throwError = false;

  if (emailAddress === 'test@test.com') {
    throwError = true;
  }

  const response = {
    status: 200,
    statusText: 'success',
  };

  // set some other response status cde
  // setResponseStatus(event, 202)

  // Throw some server side errors
  if (throwError) {
    throw createError({
      statusCode: 400,
      statusMessage: 'error',
      data: {
        errors: {
          emailAddress: 'Email address already registered',
          username: 'Username already registered',
          password: ['Password is too weak', 'Password is too short'],
        },
      },
    });
  }
  return response;
});
