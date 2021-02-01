const buildIAMPolicy = (user, effect, context) => {
  const policy = {
    principalId: user,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: "*",
        },
      ],
    },
    context,
  };
  return policy;
};

module.exports = buildIAMPolicy;
