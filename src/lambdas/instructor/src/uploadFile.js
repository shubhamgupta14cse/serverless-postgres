const { Responses, S3, withHooks } = require("../../common/src/utils");
const { Instructor } = require("../../common/src/models");

const bucket = process.env.INSTRUCTOR_BUCKET;

const handler = async (event) => {
  try {
    const user = JSON.parse(event.requestContext.authorizer.user);
    let uploadUrl;
    let updateData = {};
    if (event.body.isPublic) {
      uploadUrl = await S3.PUTPublicSignedURL(
        bucket,
        event.body.filename,
        event.body.type
      );
      updateData[event.body.key] = uploadUrl.split("?")[0];
    } else {
      uploadUrl = await S3.PUTSignedURL(
        bucket,
        event.body.filename,
        event.body.type
      );
      updateData[event.body.key] = event.body.filename;
    }
    await Instructor.update({ email: user.email }, { ...updateData });
    return Responses._200(
      {
        uploadUrl: uploadUrl,
      },
      event.headers.origin
    );
  } catch (err) {
    return Responses._400({ error: err.message }, event.headers.origin);
  }
};

exports.handler = withHooks(handler);
