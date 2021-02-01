const { Responses, withHooks } = require("../../common/src/utils");
const { Student, Instructor } = require("../../common/src/models");

/**
 * @api {get} /student/get Get Student Details
 * @apiVersion 0.0.1
 * @apiGroup Student
 * @apiHeader {String} Authorization="Bearer Token" JWT Token as "Bearer Token"
 *
 * @apiSuccess {Object} student Student Object
 *
 * @apiSuccessExample {json} Success Response:
 * {
 *    "student": {
 *        "wallet": 0,
 *        "method": "email",
 *        "classes": [
 *            "54b8efec-f430-4edf-a4da-e23a4dcd3a3f"
 *        ],
 *        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc at magna id augue mollis facilisis.",
 *        "createdAt": "2020-11-02T05:46:07.401Z",
 *        "schedule": [
 *            "2020-11-05T15:00:00.000Z",
 *            "2020-11-07T15:00:00.000Z",
 *            "2020-11-10T15:00:00.000Z",
 *            "2020-11-12T15:00:00.000Z",
 *            "2020-11-08T18:00:00.000Z"
 *        ],
 *        "phone": "9876543210",
 *        "name": "Test Student",
 *        "_id": "2fa48975-fe23-4620-95c2-997b4cd5fccd",
 *        "age": 23,
 *        "email": "test@student.com",
 *        "updatedAt": "2020-11-02T06:15:45.348Z",
 *        "wishlist": [
 *            {
 *                "gender": "male",
 *                "city": "Mumbai",
 *                "classPrefs": "both",
 *                "workSamples": [
 *                    "http://www.test.com",
 *                    "http://www.test2.com"
 *                ],
 *                "rating": 3,
 *                "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur quam in nisi tempus mattis. Aenean quis magna est. Vivamus quis cursus purus. Sed tempor laoreet congue.",
 *                "feeSolo": [
 *                    {
 *                        "skill": "guitar",
 *                        "fee": 500
 *                    },
 *                    {
 *                        "skill": "bass",
 *                        "fee": 800
 *                    }
 *                ],
 *                "skills": [
 *                    "guitar",
 *                    "bass"
 *                ],
 *                "demoClass": true,
 *                "createdAt": "2020-11-02T05:47:52.369Z",
 *                "phone": "+91 9876543210",
 *                "yearsOfExperience": [
 *                    {
 *                        "years": 5,
 *                        "skill": "guitar"
 *                    },
 *                    {
 *                        "years": 3,
 *                        "skill": "bass"
 *                    }
 *                ],
 *                "name": "Test Instructor",
 *                "_id": "a317ffa2-1b8a-402a-a1f1-3d254a9e1f73",
 *                "feeGroup": [
 *                    {
 *                        "skill": "guitar",
 *                        "fee": 350
 *                    },
 *                    {
 *                        "skill": "bass",
 *                        "fee": 500
 *                    }
 *                ],
 *                "email": "test@instructor.com",
 *                "age": 25,
 *                "updatedAt": "2020-11-02T06:01:53.749Z"
 *            }
 *        ]
 *    }
 * }
 *
 * @apiError 403 Unauthorized
 * @apiError 404 StudentNotFound
 * @apiError 400 Error
 */
const handler = async (event) => {
  try {
    const user = JSON.parse(event.requestContext.authorizer.user);
    let student = await Student.get({ _id: user._id });
    if (!student) {
      return Responses._404(
        { error: "student not found" },
        event.headers.origin
      );
    }
    student = await student.populate();
    let { wishlist, ...serialized } = student.serialize({
      exclude: ["password"],
    });
    wishlist = Instructor.serializeMany(wishlist, {
      exclude: ["password", "availability", "classes", "schedule"],
    });
    serialized.wishlist = wishlist;
    return Responses._200({ student: serialized }, event.headers.origin);
  } catch (err) {
    console.log("error", err);
    return Responses._400({ error: err.message }, event.headers.origin);
  }
};

exports.handler = withHooks(handler);
