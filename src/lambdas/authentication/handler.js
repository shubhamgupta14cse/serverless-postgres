'use strict';

const { withHooks } = require("../../utils");


module.exports.hello = withHooks(async (event, context) => {
  const { Models } = context;
  const data = await Models.Instructors.findByPk(1);
  console.log("This is the user ------------->", data)
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
});
