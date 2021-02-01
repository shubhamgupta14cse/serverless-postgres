const { Responses, hooksWithValidation } = require("../../common/src/utils");
const { Instructor } = require("../../common/src/models");
const yup = require("yup");

const updateInstructorSchema = yup
  .object()
  .shape({
    bio: yup.string(),
    classPrefs: yup.string(),
    workSamples: yup.array().of(yup.string()),
    demoClass: yup.boolean(),
  })
  .noUnknown(true);

/**
 * @api {put} /instructor/update Update Instructor Details
 * @apiVersion 0.0.1
 * @apiGroup Instructor
 * @apiHeader {String} Authorization="Bearer Token" JWT Token as "Bearer Token"
 *
 * @apiParam (Body) {String="solo", "group", "both"} [classPrefs] Class Preferences
 * @apiParam (Body) {String} [bio] Bio
 * @apiParam (Body) {String[]} [workSamples] Work Samples
 * @apiParam (Body) {Boolean} [demoClass] Willing to take Demo Class?
 *
 * @apiParamExample {json} Request Body:
 * {
 *   "classPrefs": "both",
 *   "bio": "lorem ipsum doler set gint les sengtum",
 *   "workSamples": ["http://www.test3.com"],
 *   "demoClass": false,
 * }
 *
 * @apiSuccess {Object} updated_instructor Updated Instructor
 *
 * @apiSuccessExample {json} Success Response:
 * {
 *    "updated_instructor": {
 *        "gender": "male",
 *        "city": "Mumbai",
 *        "classPrefs": "both",
 *        "workSamples": [
 *            "http://www.test3.com"
 *        ],
 *        "classes": [
 *            "a3c6e334-1758-493b-8919-e06fd7c4b3d4",
 *            "54b8efec-f430-4edf-a4da-e23a4dcd3a3f"
 *        ],
 *        "rating": 3,
 *        "bio": "lorem ipsum doler set gint les sengtum",
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
 *        "demoClass": false,
 *        "skills": [
 *            "guitar",
 *            "bass"
 *        ],
 *        "createdAt": "2020-11-02T05:47:52.369Z",
 *        "schedule": [
 *            "2020-11-02T18:00:00.000Z",
 *            "2020-11-04T18:00:00.000Z",
 *            "2020-11-05T15:00:00.000Z",
 *            "2020-11-07T15:00:00.000Z",
 *            "2020-11-10T15:00:00.000Z",
 *            "2020-11-12T15:00:00.000Z",
 *            "2020-11-08T18:00:00.000Z"
 *        ],
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
 *        "age": 25,
 *        "email": "test@instructor.com",
 *        "updatedAt": "2020-11-02T06:19:57.821Z"
 *    }
 * }
 *
 * @apiError 403 Unauthorized
 * @apiError 400 Error
 */
const handler = async (event) => {
  try {
    const user = JSON.parse(event.requestContext.authorizer.user);
    const updateData = event.body;
    const updatedInstructor = await Instructor.update(
      { _id: user._id },
      { ...updateData },
      { return: "document" }
    );
    const serialized = updatedInstructor.serialize({ exclude: ["password"] });
    return Responses._200(
      { updated_instructor: serialized },
      event.headers.origin
    );
  } catch (err) {
    console.log("error", err);
    return Responses._400({ error: err.message }, event.headers.origin);
  }
};

exports.handler = hooksWithValidation(handler, updateInstructorSchema);
