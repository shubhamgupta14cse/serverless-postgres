const { Responses, hooksWithValidation } = require("../../common/src/utils");
const { Student } = require("../../common/src/models");
const yup = require("yup");

const updateStudentSchema = yup
  .object()
  .shape({
    name: yup.string(),
    phone: yup.string(),
    age: yup.number().moreThan(0),
    bio: yup.string(),
  })
  .noUnknown(true);

/**
 * @api {put} /student/update Update Student Details
 * @apiVersion 0.0.1
 * @apiGroup Student
 * @apiHeader {String} Authorization="Bearer Token" JWT Token as "Bearer Token"
 *
 * @apiParam (Body) {String} [name] Name
 * @apiParam (Body) {String} [phone] Phone
 * @apiParam (Body) {Number} [age] Age
 * @apiParam (Body) {String} [bio] Bio
 *
 * @apiParamExample {json} Request Body:
 * {
 *     "name": "Test Student",
 *     "phone": "9876543210",
 *     "age": 23,
 *     "bio": "test bio"
 * }
 *
 * @apiSuccess {Object} updated_student Updated Student
 *
 * @apiSuccessExample {json} Success Response:
 * {
 *    "updated_student": {
 *        "wallet": 0,
 *        "method": "email",
 *        "wishlist": [
 *            "a317ffa2-1b8a-402a-a1f1-3d254a9e1f73"
 *        ],
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
 *        "updatedAt": "2020-11-02T06:15:45.348Z"
 *    }
 * }
 *
 * @apiError 401 Unauthorized
 * @apiError 400 Error
 */
const handler = async (event) => {
  try {
    const user = JSON.parse(event.requestContext.authorizer.user);
    const updateData = event.body;
    const updatedStudent = await Student.update(
      { _id: user._id },
      { ...updateData },
      { return: "document" }
    );
    const serialized = updatedStudent.serialize({ exclude: ["password"] });
    return Responses._200(
      { updated_student: serialized },
      event.headers.origin
    );
  } catch (err) {
    console.log("error", err);
    return Responses._400({ error: err.message }, event.headers.origin);
  }
};

exports.handler = hooksWithValidation(handler, updateStudentSchema);
