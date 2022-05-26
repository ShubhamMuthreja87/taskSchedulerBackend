import { celebrate, Joi } from "celebrate";
import { Router } from "express";
import ErrorCodes from "../../../constants/errors";
import Task from "../../../models/Task";
import isUserAuth from "../../middlewares/isUserAuth";

const userOpsRouter = Router();

userOpsRouter.post(
  "/taskByUserId",
  isUserAuth,
  celebrate(
    {
      body: Joi.object({
        userId: Joi.string().required(),
      }),
    },
    { abortEarly: false, allowUnknown: false }
  ),
  async (req, res) => {
    const { userId } = req.body;
    try {
      const tasks = await Task.find({ userId });
      return res.send({
        code: "00",
        tasks,
      });
    } catch (err) {
      return res.status(500).send(ErrorCodes.U1);
    }
  }
);

userOpsRouter.post("/markAsDone",isUserAuth,celebrate({
  body:Joi.object({
    taskId :Joi.string().required()
  })
},
{ abortEarly: false, allowUnknown: false }
),
async (req, res) => {
  const { taskId } = req.body;
  try {
    const task = await Task.findOneAndUpdate({ _id:taskId },{done:true},{  upsert: true, returnDocument: 'after' });
    return res.send({
      code: "00",
      task,
    });
  } catch (err) {
    return res.status(500).send(ErrorCodes.U1);
  }
});
export default userOpsRouter;
