const { Responses, hooksWithValidation } = require("../../common/src/utils");
const { Student, Instructor } = require("../../common/src/models");
const yup = require("yup");

const wishlistSchema = yup
  .object()
  .shape({
    student: yup.string().required(),
    operation: yup.string().required(),
    instructor: yup.string().required(),
  })
  .noUnknown(true);

/**
 * @api {put} /student/wishlist Update Student Wishlist
 * @apiVersion 0.0.1
 * @apiGroup Student
 * @apiHeader {String} Authorization="Bearer Token" JWT Token as "Bearer Token"
 *
 * @apiParam (Body) {String} student Student ID
 * @apiParam (Body) {String="add","remove"} operation Type Of Operation
 * @apiParam (Body) {String} instructor Instructor ID
 *
 * @apiParamExample {json} Request Body (Add):
 * {
 *    "student": "9c7aa1a7-4663-4cb1-a32e-a6a3e0909bc1",
 *    "operation": "add",
 *    "instructor": "1afc1161-3a89-498a-8d67-1876158d103a"
 * }
 * @apiParamExample {json} Request Body (Remove):
 * {
 *    "student": "9c7aa1a7-4663-4cb1-a32e-a6a3e0909bc1",
 *    "operation": "remove",
 *    "instructor": "1afc1161-3a89-498a-8d67-1876158d103a"
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
 *        "updatedAt": "2020-11-02T06:07:23.033Z"
 *    }
 * }
 *
 * @apiError 401 Unauthorized
 * @apiError 400 Error
 */
const handler = async (event) => {
  try {
    if (event.body.operation === "add") {
      const instructor = await Instructor.get({ _id: event.body.instructor });
      if (!instructor) {
        return Responses._404(
          { error: "invalid instructor ID" },
          event.headers.origin
        );
      }
      const student = await Student.get({ _id: event.body.student });
      if (!student) {
        return Responses._404(
          { error: "invalid student ID" },
          event.headers.origin
        );
      }
      student.wishlist.push(instructor._id);
      await student.save();
      const serialized = student.serialize({ exclude: ["password"] });
      return Responses._200(
        { updated_student: serialized },
        event.headers.origin
      );
    } else if (event.body.operation === "remove") {
      const student = await Student.get({ _id: event.body.student });
      if (!student) {
        return Responses._404(
          { error: "invalid student ID" },
          event.headers.origin
        );
      }
      student.wishlist.forEach((ins, index) => {
        if (ins.email === event.body.instructor) {
          student.wishlist.splice(index, 1);
        }
      });
      await student.save();
      const serialized = student.serialize({ exclude: ["password"] });
      return Responses._200(
        { updated_student: serialized },
        event.headers.origin
      );
    } else {
      return Responses._400(
        { error: "invalid operation" },
        event.headers.origin
      );
    }
  } catch (err) {
    console.log("error", err);
    return Responses._400({ error: err.message }, event.headers.origin);
  }
};

exports.handler = hooksWithValidation(handler, wishlistSchema);
