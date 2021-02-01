const yup = require("yup");
const jwt = require("jsonwebtoken");
const { Responses, hooksWithValidation } = require("../../common/src/utils");
const bcrypt = require("bcryptjs");
const { Student, Instructor } = require("../../common/src/models");

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

/**
 * @api {post} /student/login Student Login
 * @apiVersion 0.0.1
 * @apiGroup Student
 *
 * @apiParam (Body) {String} email Email
 * @apiParam (Body) {String} password Password
 *
 * @apiParamExample {json} Request Body:
 * {
 *     "email": "test@student.com",
 *     "password": "1234567890"
 * }
 *
 * @apiSuccess {String} token JWT Token
 * @apiSuccess {Object} student Student Object
 *
 * @apiSuccessExample {json} Success Response:
 * {
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjJmYTQ4OTc1LWZlMjMtNDYyMC05NWMyLTk5N2I0Y2Q1ZmNjZCIsImVtYWlsIjoidGVzdEBzdHVkZW50LmNvbSJ9LCJ0eXBlIjoic3R1ZGVudCIsImlhdCI6MTYwNDI5NzY2MiwiZXhwIjoxNjA0MzQwODYyfQ.qhgwaEF7JC41VSS7j_pMHCUW81BT_LxsDN491KLyEe0",
 *    "student": {
 *        "wallet": 0,
 *        "method": "email",
 *        "classes": [
 *            "54b8efec-f430-4edf-a4da-e23a4dcd3a3f"
 *        ],
 *        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc at magna id augue mollis facilisis. Vivamus eu enim consectetur, suscipit justo id, dictum eros. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
 *        "schedule": [
 *            "2020-11-05T15:00:00.000Z",
 *            "2020-11-07T15:00:00.000Z",
 *            "2020-11-10T15:00:00.000Z",
 *            "2020-11-12T15:00:00.000Z",
 *            "2020-11-08T18:00:00.000Z"
 *        ],
 *        "createdAt": "2020-11-02T05:46:07.401Z",
 *        "phone": "+91 99999 99999",
 *        "name": "Test Student",
 *        "_id": "2fa48975-fe23-4620-95c2-997b4cd5fccd",
 *        "email": "test@student.com",
 *        "age": 16,
 *        "updatedAt": "2020-11-02T06:07:23.033Z",
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
 * @apiError 401 InvalidCredentials
 * @apiError 404 StudentNotFound
 * @apiError 400 Error
 */
const handler = async (event) => {
  try {
    const creds = event.body;
    const results = await Student.scan("email").eq(creds.email).exec();
    if (!results[0]) {
      return Responses._404(
        { error: "student not found" },
        event.headers.origin
      );
    }
    const student = results[0];
    const validPass = await bcrypt.compare(creds.password, student.password);
    if (!validPass) {
      return Responses._401(
        { error: "invalid credentials" },
        event.headers.origin
      );
    }
    const serialized = student.serialize({ include: ["_id", "email"] });
    let { wishlist, ...studentObj } = student.serialize({
      exclude: ["password"],
    });
    wishlist = Instructor.serializeMany(wishlist, {
      exclude: ["password", "availability", "classes", "schedule"],
    });
    studentObj.wishlist = wishlist;
    const token = jwt.sign(
      { user: serialized, type: "student" },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }
    );
    return Responses._200(
      { token: token, student: studentObj },
      event.headers.origin
    );
  } catch (err) {
    console.log("error", err);
    return Responses._400({ error: err.message }, event.headers.origin);
  }
};

exports.handler = hooksWithValidation(handler, loginSchema);
