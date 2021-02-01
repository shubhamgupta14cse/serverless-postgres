const { v4: uuidv4 } = require("uuid");
const yup = require("yup");
const jwt = require("jsonwebtoken");
const { Responses, hooksWithValidation } = require("../../common/src/utils");
const { Student } = require("../../common/src/models");
const bcrypt = require("bcryptjs");

const registerStudentSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  age: yup.number().moreThan(0).required(),
});

/**
 * @api {post} /student/register Student Signup
 * @apiVersion 0.0.1
 * @apiGroup Student
 *
 * @apiParam (Body) {String} name Name
 * @apiParam (Body) {String} email Email
 * @apiParam (Body) {String} password Password
 * @apiParam (Body) {Number} age Age
 *
 * @apiParamExample {json} Request Body:
 * {
 *     "email": "test@student.com",
 *     "name": "Test Student",
 *     "age": 16,
 *     "password": "1234567890"
 * }
 *
 * @apiSuccess {String} token JWT Token
 * @apiSuccess {Object} student Student Object
 *
 * @apiSuccessExample {json} Success Response:
 * {
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjJmYTQ4OTc1LWZlMjMtNDYyMC05NWMyLTk5N2I0Y2Q1ZmNjZCIsImVtYWlsIjoidGVzdEBzdHVkZW50LmNvbSJ9LCJ0eXBlIjoic3R1ZGVudCIsImlhdCI6MTYwNDI5NTk2NywiZXhwIjoxNjA0MzM5MTY3fQ.NBCwS5wGsA86zYQUdMxvYdpnGwePYR7dmp_sju_UX8c",
 *    "student": {
 *        "_id": "2fa48975-fe23-4620-95c2-997b4cd5fccd",
 *        "email": "test@student.com",
 *        "method": "email",
 *        "name": "Test Student",
 *        "age": 16,
 *        "phone": "+91 99999 99999",
 *        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc at magna id augue mollis facilisis. Vivamus eu enim consectetur, suscipit justo id, dictum eros. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
 *        "wallet": 0,
 *        "wishlist": [],
 *        "classes": [],
 *        "schedule": [],
 *        "createdAt": "2020-11-02T05:46:07.401Z",
 *        "updatedAt": "2020-11-02T05:46:07.401Z"
 *    }
 * }
 *
 * @apiError 401 StudentAlreadyExists
 * @apiError 400 Error
 */
const handler = async (event) => {
  try {
    const exists = await Student.scan("email").eq(event.body.email).exec();
    if (exists[0]) {
      return Responses._401(
        { error: "student already exists" },
        event.headers.origin
      );
    }
    const _id = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(event.body.password, salt);
    const student = new Student({
      _id: _id,
      email: event.body.email,
      password: hashed,
      method: "email",
      name: event.body.name,
      age: event.body.age,
      phone: "+91 99999 99999",
      bio:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc at magna id augue mollis facilisis. Vivamus eu enim consectetur, suscipit justo id, dictum eros. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      wallet: 0,
      wishlist: [],
      classes: [],
      schedule: [],
    });
    await student.save();
    const serialized = student.serialize({ include: ["_id", "email"] });
    const responseStudent = student.serialize({ exclude: ["password"] });
    const token = jwt.sign(
      { user: serialized, type: "student" },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }
    );
    return Responses._200(
      { token: token, student: responseStudent },
      event.headers.origin
    );
  } catch (err) {
    console.log("error", err);
    return Responses._400({ error: err.message }, event.headers.origin);
  }
};

exports.handler = hooksWithValidation(handler, registerStudentSchema);
