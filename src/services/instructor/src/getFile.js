const { Responses, S3, withHooks } = require("../../common/src/utils");

const bucket = process.env.INSTRUCTOR_BUCKET;

const handler = async (event) => {
  try {
    const getUrl = await S3.GETSignedURL(bucket, event.body.filename);
    return Responses._200(
      {
        getUrl: getUrl,
      },
      event.headers.origin
    );
  } catch (err) {
    return Responses._400({ error: err.message }, event.headers.origin);
  }
};

exports.handler = withHooks(handler);
