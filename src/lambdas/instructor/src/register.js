const { v4: uuidv4 } = require("uuid");
const yup = require("yup");
const jwt = require("jsonwebtoken");
const { Responses, hooksWithValidation } = require("../../common/src/utils");
const { Instructor } = require("../../common/src/models");
const bcrypt = require("bcryptjs");

const registerInstructorSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
  name: yup.string().required(),
  age: yup.number().moreThan(0).required(),
  phone: yup.string().required(),
  bio: yup.string().required(),
  gender: yup.string().required(),
  skills: yup.array().of(yup.string()).required(),
  classPrefs: yup.string().required(),
  city: yup.string().required(),
  feeSolo: yup.array().required(),
  feeGroup: yup.array().required(),
  yearsOfExperience: yup.array().required(),
  workSamples: yup.array().of(yup.string()).required(),
  demoClass: yup.boolean().required(),
});

/**
 * @api {post} /instructor/register Instructor Signup
 * @apiVersion 0.0.1
 * @apiGroup Instructor
 *
 * @apiParam (Body) {String} email Email
 * @apiParam (Body) {String} password Password
 * @apiParam (Body) {String} name Name
 * @apiParam (Body) {Number} age Age
 * @apiParam (Body) {String} phone Phone
 * @apiParam (Body) {String} bio Bio
 * @apiParam (Body) {String="male", "female", "other"} gender Gender
 * @apiParam (Body) {String[]} skills Skills Array
 * @apiParam (Body) {String="solo", "group", "both"} classPrefs Class Preferences
 * @apiParam (Body) {String} city City
 * @apiParam (Body) {Object[]} feeSolo Fee Solo Class
 * @apiParam (Body) {String} feeSolo.skill Skill
 * @apiParam (Body) {Number} feeSolo.fee Fee
 * @apiParam (Body) {Object[]} feeGroup Fee Group Class
 * @apiParam (Body) {String} feeGroup.skill Skill
 * @apiParam (Body) {Number} feeGroup.fee Fee
 * @apiParam (Body) {Object[]} yearsOfExperience Years of Experience
 * @apiParam (Body) {String} yearsOfExperience.skill Skill
 * @apiParam (Body) {Number} yearsOfExperience.years Years
 * @apiParam (Body) {String[]} workSamples Work Samples
 * @apiParam (Body) {Boolean} demoClass Willing to take Demo Class?
 *
 * @apiParamExample {json} Request Body:
 * {
 *   "email": "test@instructor.com",
 *   "password": "1234567890",
 *   "name": "Test Instructor",
 *   "age": 22,
 *   "phone": "+91 9876543210",
 *   "bio": "Lead guitars for XFactor",
 *   "gender": "male",
 *   "skills": ["guitar", "bass"],
 *   "classPrefs": "both",
 *   "city": "Mumbai",
 *   "feeSolo": [{"skill": "guitar", "fee": 500},{"skill": "bass", "fee": 800}],
 *   "feeGroup": [{"skill": "guitar", "fee": 350},{"skill": "bass", "fee": 500}],
 *   "yearsOfExperience": [{"skill": "guitar", "years": 5},{"skill": "bass", "years": 3}],
 *   "workSamples": [
 *      "http://www.test.com",
 *      "http://www.test2.com"
 *   ],
 *   "demoClass": true
 * }
 *
 * @apiSuccess {String} token JWT Token
 * @apiSuccess {Object} instructor Instructor Object
 *
 * @apiSuccessExample {json} Success Response:
 * {
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6ImEzMTdmZmEyLTFiOGEtNDAyYS1hMWYxLTNkMjU0YTllMWY3MyIsImVtYWlsIjoidGVzdEBpbnN0cnVjdG9yLmNvbSJ9LCJ0eXBlIjoiaW5zdHJ1Y3RvciIsImlhdCI6MTYwNDI5NjA3MiwiZXhwIjoxNjA0MzM5MjcyfQ.IwdVJdj4hhSxwTEVDwMhyoI8RGVjn-bcYBV-CTDM00I",
 *    "instructor": {
 *        "_id": "a317ffa2-1b8a-402a-a1f1-3d254a9e1f73",
 *        "email": "test@instructor.com",
 *        "name": "Test Instructor",
 *        "age": 25,
 *        "phone": "+91 9876543210",
 *        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur quam in nisi tempus mattis. Aenean quis magna est. Vivamus quis cursus purus. Sed tempor laoreet congue.",
 *        "gender": "male",
 *        "skills": [
 *            "guitar",
 *            "bass"
 *        ],
 *        "classPrefs": "both",
 *        "city": "Mumbai",
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
 *        "yearsOfExperience": [
 *            {
 *                "skill": "guitar",
 *                "years": 5
 *            },
 *            {
 *                "skill": "bass",
 *                "years": 3
 *            }
 *        ],
 *        "workSamples": [
 *            "http://www.test.com",
 *            "http://www.test2.com"
 *        ],
 *        "demoClass": true,
 *        "classes": [],
 *        "schedule": [],
 *        "availability": {
 *            "monday": [
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
 *            "saturday": [
 *                11,
 *                12,
 *                14,
 *                15,
 *                16,
 *                17,
 *                18
 *            ],
 *            "sunday": [
 *                11,
 *                12,
 *                14,
 *                15,
 *                16,
 *                17,
 *                18
 *            ]
 *        },
 *        "rating": 3,
 *        "createdAt": "2020-11-02T05:47:52.369Z",
 *        "updatedAt": "2020-11-02T05:47:52.369Z"
 *    }
 * }
 *
 * @apiError 401 InstructorAlreadyExists
 * @apiError 400 Error
 */
const handler = async (event) => {
  try {
    const exists = await Instructor.scan("email").eq(event.body.email).exec();
    if (exists[0]) {
      return Responses._401(
        { error: "instructor already exists" },
        event.headers.origin
      );
    }
    let _id = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(event.body.password, salt);
    const instructor = new Instructor({
      _id: _id,
      email: event.body.email,
      password: hashed,
      name: event.body.name,
      age: event.body.age,
      phone: event.body.phone,
      bio: event.body.bio,
      gender: event.body.gender,
      skills: event.body.skills,
      classPrefs: event.body.classPrefs,
      city: event.body.city,
      feeSolo: event.body.feeSolo,
      feeGroup: event.body.feeGroup,
      yearsOfExperience: event.body.yearsOfExperience,
      workSamples: event.body.workSamples,
      demoClass: event.body.demoClass,
      classes: [],
      schedule: [],
      availability: {
        monday: [11, 12, 14, 15, 16, 17, 18],
        tuesday: [11, 12, 14, 15, 16, 17, 18],
        wednesday: [11, 12, 14, 15, 16, 17, 18],
        thursday: [11, 12, 14, 15, 16, 17, 18],
        friday: [11, 12, 14, 15, 16, 17, 18],
        saturday: [11, 12, 14, 15, 16, 17, 18],
        sunday: [11, 12, 14, 15, 16, 17, 18],
      },
      rating: 3,
    });
    await instructor.save();
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

exports.handler = hooksWithValidation(handler, registerInstructorSchema);
