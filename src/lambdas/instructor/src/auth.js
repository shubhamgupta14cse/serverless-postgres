const { withHooks, buildIAMPolicy } = require("../../common/src/utils");
const { decodeToken } = require("../../common/src/auth");

const handler = async (event) => {
  const awsToken =
    (event.headers &&
      (event.headers["X-Amz-Security-Token"] ||
        event.headers["x-amz-security-token"])) ||
    event.authorizationToken;
  if (!awsToken) {
    return buildIAMPolicy("undefined", "Deny", {});
  }
  const tokenParts = awsToken.split(" ");
  const token = tokenParts[1];
  if (!(tokenParts[0].toLowerCase() === "bearer" && token)) {
    return buildIAMPolicy("undefined", "Deny", {});
  }
  const user = decodeToken(token);
  if (user != null) {
    const authorizerContext = { user: JSON.stringify(user) };
    return buildIAMPolicy(user.email, "Allow", authorizerContext);
  } else {
    return buildIAMPolicy("undefined", "Deny", {});
  }
};

exports.handler = withHooks(handler);
