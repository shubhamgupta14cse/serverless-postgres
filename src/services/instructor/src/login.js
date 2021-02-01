const yup = require("yup");
const jwt = require("jsonwebtoken");
const { Responses, hooksWithValidation } = require("../../common/src/utils");
const bcrypt = require("bcryptjs");

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

/**
 * @api {post} /instructor/login Instructor Login
 * @apiVersion 0.0.1
 * @apiGroup Instructor
 *
 * @apiParam (Body) {String} email Email
 * @apiParam (Body) {String} password Password
 *
 * @apiParamExample {json} Request Body:
 * {
 *   "email": "test@instructor.com",
 *   "password": "1234567890",
 * }
 *
 * @apiSuccess {String} token JWT Token
 * @apiSuccess {Object} instructor Instructor Object
 *
 * @apiSuccessExample {json} Success Response:
 * {
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6ImEzMTdmZmEyLTFiOGEtNDAyYS1hMWYxLTNkMjU0YTllMWY3MyIsImVtYWlsIjoidGVzdEBpbnN0cnVjdG9yLmNvbSJ9LCJ0eXBlIjoiaW5zdHJ1Y3RvciIsImlhdCI6MTYwNDI5NzkzMSwiZXhwIjoxNjA0MzQxMTMxfQ.NEetx9VhxZzIp583KORrx2net1sjdTveYW5pMmt9DRA",
 *    "instructor": {
 *        "gender": "male",
 *        "city": "Mumbai",
 *        "classPrefs": "both",
 *        "workSamples": [
 *            "http://www.test.com",
 *            "http://www.test2.com"
 *        ],
 *        "classes": [
 *            "a3c6e334-1758-493b-8919-e06fd7c4b3d4",
 *            "54b8efec-f430-4edf-a4da-e23a4dcd3a3f"
 *        ],
 *        "rating": 3,
 *        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur quam in nisi tempus mattis. Aenean quis magna est. Vivamus quis cursus purus. Sed tempor laoreet congue.",
 *        "availability": {
 *            "sunday": [
 *                11,
 *                12,
 *                14,
 *                15,
 *                16,
 *                17,
 *                18
 *            ],
 *            "saturday": [
 *                11,
 *                12,
 *                14,
 *                15,
 *                16,
 *                17,
 *                18
 *            ],
 *            "tuesday": [
 *                11,
 *                12,
 *                14,
 *                15,
 *                16,
 *                17,
 *                18
 *            ],
 *            "wednesday": [
 *                11,
 *                12,
 *                14,
 *                15,
 *                16,
 *                17,
 *                18
 *            ],
 *            "thursday": [
 *                11,
 *                12,
 *                14,
 *                15,
 *                16,
 *                17,
 *                18
 *            ],
 *            "friday": [
 *                11,
 *                12,
 *                14,
 *                15,
 *                16,
 *                17,
 *                18
 *            ],
 *            "monday": [
 *                11,
 *                12,
 *                14,
 *                15,
 *                16,
 *                17,
 *                18
 *            ]
 *        },
 *        "feeSolo": [
 *            {
 *                "skill": "guitar",
 *                "fee": 500
 *            },
 *            {
 *                "skill": "bass",
 *                "fee": 800
 *            }
 *        ],
 *        "skills": [
 *            "guitar",
 *            "bass"
 *        ],
 *        "demoClass": true,
 *        "schedule": [
 *            "2020-11-02T18:00:00.000Z",
 *            "2020-11-04T18:00:00.000Z",
 *            "2020-11-05T15:00:00.000Z",
 *            "2020-11-07T15:00:00.000Z",
 *            "2020-11-10T15:00:00.000Z",
 *            "2020-11-12T15:00:00.000Z",
 *            "2020-11-08T18:00:00.000Z"
 *        ],
 *        "createdAt": "2020-11-02T05:47:52.369Z",
 *        "phone": "+91 9876543210",
 *        "yearsOfExperience": [
 *            {
 *                "years": 5,
 *                "skill": "guitar"
 *            },
 *            {
 *                "years": 3,
 *                "skill": "bass"
 *            }
 *        ],
 *        "name": "Test Instructor",
 *        "_id": "a317ffa2-1b8a-402a-a1f1-3d254a9e1f73",
 *        "feeGroup": [
 *            {
 *                "skill": "guitar",
 *                "fee": 350
 *            },
 *            {
 *                "skill": "bass",
 *                "fee": 500
 *            }
 *        ],
 *        "email": "test@instructor.com",
 *        "age": 25,
 *        "updatedAt": "2020-11-02T06:01:53.749Z"
 *    }
 * }
 *
 * @apiError 401 InvalidCredentials
 * @apiError 404 InstructorNotFound
 * @apiError 400 Error
 */
const handler = async (event, context) => {
  const { Models } = context;
  const Instructor = new Models.Instructors();
  console.log(Instructor);
  try {
    const creds = event.body;
    const results = await Instructor.findAll({ where: { email: creds.email } });
    if (!results[0]) {
      return Responses._404(
        { error: "instructor not found" },
        event.headers.origin
      );
    }
    const instructor = results[0];
    const validPass = await bcrypt.compare(creds.password, instructor.password);
    if (!validPass) {
      return Responses._401(
        { message: "invalid credentials" },
        event.headers.origin
      );
    }
    const serialized = instructor.serialize({ include: ["_id", "email"] });
    const responseInstructor = instructor.serialize({ exclude: ["password"] });
    const token = jwt.sign(
      { user: serialized, type: "instructor" },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }
    );
    return Responses._200(
      { token: token, instructor: responseInstructor },
      event.headers.origin
    );
  } catch (err) {
    console.log("error", err);
    return Responses._400({ error: err.message }, event.headers.origin);
  }
};

exports.handler = hooksWithValidation(handler, loginSchema);
