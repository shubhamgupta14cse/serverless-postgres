const {
  useHooks,
  logEvent,
  parseEvent,
  handleUnexpectedError,
} = require("lambda-hooks");
const connectToDatabase = require('./db');

const withHooks = (lambda) => {
  return useHooks({
    before: [logEvent, parseEvent, sequelizeHook],
    after: [],
    onError: [handleUnexpectedError],
  })(lambda);
};

const hooksWithValidation = (lambda, bodySchema) => {
  return useHooks(
    {
      before: [logEvent, parseEvent, validateEventBody, sequelizeHook],
      after: [],
      onError: [handleUnexpectedError],
    },
    {
      bodySchema,
    }
  )(lambda);
};

const validateEventBody = async (state) => {
  const { bodySchema } = state.config;
  if (!bodySchema) {
    throw new Error("missing the required body schema");
  }
  try {
    const { event } = state;
    await bodySchema.validate(event.body, { strict: true });
  } catch (error) {
    console.log("yup validation error", error);
    state.exit = true;
    state.response = {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
  return state;
};

const sequelizeHook = async state => {
  try {
    const { context } = state;
    const Models = await connectToDatabase();
    context.Models = Models;
  } catch (error) {
    console.log("Sequelize Sync error", error);
    state.exit = true;
    state.response = {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
  return state;
}

module.exports = { withHooks, hooksWithValidation };
