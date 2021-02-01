const { Responses, withHooks } = require("../../common/src/utils");
const { Instructor } = require("../../common/src/models");

/**
 * @api {get} /instructor/list Get Instructor Listings
 * @apiVersion 0.0.1
 * @apiGroup Instructor
 *
 * @apiSuccess {Object[]} instructors List of Instructor Objects
 *
 * @apiSuccessExample {json} Success Response:
 * {
 *    "instructors": [
 *        {
 *            "gender": "male",
 *            "city": "Mumbai",
 *            "classPrefs": "both",
 *            "workSamples": [
 *                "http://www.test.com",
 *                "http://www.test2.com"
 *            ],
 *            "classes": [],
 *            "rating": 3,
 *            "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur quam in nisi tempus mattis. Aenean quis magna est. Vivamus quis cursus purus. Sed tempor laoreet congue.",
 *            "availability": {
 *                "sunday": [
 *                    11,
 *                    12,
 *                    14,
 *                    15,
 *                    16,
 *                    17,
 *                    18
 *                ],
 *                "saturday": [
 *                    11,
 *                    12,
 *                    14,
 *                    15,
 *                    16,
 *                    17,
 *                    18
 *                ],
 *                "tuesday": [
 *                    11,
 *                    12,
 *                    14,
 *                    15,
 *                    16,
 *                    17,
 *                    18
 *                ],
 *                "wednesday": [
 *                    11,
 *                    12,
 *                    14,
 *                    15,
 *                    16,
 *                    17,
 *                    18
 *                ],
 *                "thursday": [
 *                    11,
 *                    12,
 *                    14,
 *                    15,
 *                    16,
 *                    17,
 *                    18
 *                ],
 *                "friday": [
 *                    11,
 *                    12,
 *                    14,
 *                    15,
 *                    16,
 *                    17,
 *                    18
 *                ],
 *                "monday": [
 *                    11,
 *                    12,
 *                    14,
 *                    15,
 *                    16,
 *                    17,
 *                    18
 *                ]
 *            },
 *            "feeSolo": [
 *                {
 *                    "skill": "guitar",
 *                    "fee": 500
 *                },
 *                {
 *                    "skill": "bass",
 *                    "fee": 800
 *                }
 *            ],
 *            "skills": [
 *                "guitar",
 *                "bass"
 *            ],
 *            "demoClass": true,
 *            "schedule": [],
 *            "phone": "+91 9876543210",
 *            "yearsOfExperience": [
 *                {
 *                    "years": 5,
 *                    "skill": "guitar"
 *                },
 *                {
 *                    "years": 3,
 *                    "skill": "bass"
 *                }
 *            ],
 *            "name": "Test Instructor",
 *            "_id": "a317ffa2-1b8a-402a-a1f1-3d254a9e1f73",
 *            "feeGroup": [
 *                {
 *                    "skill": "guitar",
 *                    "fee": 350
 *                },
 *                {
 *                    "skill": "bass",
 *                    "fee": 500
 *                }
 *            ],
 *            "email": "test@instructor.com",
 *            "age": 25
 *        }
 *    ]
 * }
 *
 * @apiError 403 Unauthorized
 * @apiError 400 Error
 */
const handler = async (event) => {
  try {
    const instructors = await Instructor.scan().exec();
    const serialized = Instructor.serializeMany(instructors, {
      exclude: ["password", "createdAt", "updatedAt"],
    });
    return Responses._200({ instructors: serialized }, event.headers.origin);
  } catch (err) {
    console.log("error", err);
    return Responses._400({ error: err.message }, event.headers.origin);
  }
};

exports.handler = withHooks(handler);
