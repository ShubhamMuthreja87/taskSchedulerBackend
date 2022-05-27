import { celebrate, Joi } from "celebrate";
import { Router } from "express";

import ErrorCodes from "../../../constants/errors";

import Task from "../../../models/Task";
import User from "../../../models/User";

import isUserAuth from "../../middlewares/isUserAuth";
import { getWeek } from "date-fns";

const managerOpsRouter = Router();

managerOpsRouter.post(
  "/createTask",
  isUserAuth,
  celebrate(
    {
      body: Joi.object({
        userId: Joi.string().required(),
        managerId: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        deadLine: Joi.date().required(),
        buffer: Joi.number().required(),
        length: Joi.number().required(),
      }),
    },
    { abortEarly: false, allowUnknown: false }
  ),
  async (req, res) => {
    const { userId, managerId, name, description, deadLine, buffer, length } =
      req.body;
      let weekNum = getWeek(deadLine);
      try{
        const listOfTaskforUser = await Task.find({userId,week:weekNum});
        const user = await User.find({_id:userId});
        console.log(user);
        let bookedTime=0;
        if(listOfTaskforUser){
          for(let i=0;i<listOfTaskforUser.length;i++){
            bookedTime+=listOfTaskforUser[i].length;
          }
          console.log(bookedTime);
          if(bookedTime+length<= user[0].workHrs){
            const task = await Task.create({
              userId,
              managerId,
              name,
              description,
              deadLine: deadLine,
              buffer,
              length,
              week: weekNum ,
              done: false,
              active :true,
              forwardedTimes: 0,
            });
        
            return res.send({
              code: "00",
              task: {
                name: task.name,
                description: task.description,
              },
            }); 
          }else{
            return res.send({
              code: "02",
              message:"Task Not created User is busy"
            }); 
          }
          // return res.send({
          //   code: "00",
          //   user: {
          //     // name: task.name,
          //     // description: task.description,
          //   },
          // });
        }else{
          const task = await Task.create({
            userId,
            managerId,
            name,
            description,
            deadLine: deadLine,
            buffer,
            length,
            week: weekNum ,
            done: false,
            forwardedTimes: 0,
          });
      
          return res.send({
            code: "00",
            task: {
              name: task.name,
              description: task.description,
            },
          });
        }
      }catch(e){
        return res.status(500).send(ErrorCodes.U1);
      }   
  }
);

managerOpsRouter.post( "/userByManagerId",
isUserAuth,
celebrate(
  {
    body: Joi.object({
      managerId: Joi.string().required(),
    }),
  },
  { abortEarly: false, allowUnknown: false }
),
async (req, res) => {
  const { managerId } = req.body;
  try {
    const users = await User.find({ managerId , isApproved :true });
    return res.send({
      code: "00",
      users,
    });
  } catch (err) {
    return res.status(500).send(ErrorCodes.U1);
  }
}
);

managerOpsRouter.post( "/unApprovedUserByManagerId",
isUserAuth,
celebrate(
  {
    body: Joi.object({
      managerId: Joi.string().required(),
    }),
  },
  { abortEarly: false, allowUnknown: false }
),
async (req, res) => {
  const { managerId } = req.body;
  try {
    const users = await User.find({ managerId , isApproved :false });
    return res.send({
      code: "00",
      users,
    });
  } catch (err) {
    return res.status(500).send(ErrorCodes.U1);
  }
}
);


managerOpsRouter.post("/markAsApproved",isUserAuth,celebrate({
  body:Joi.object({
    userId :Joi.string().required()
  })
},
{ abortEarly: false, allowUnknown: false }
),
async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findOneAndUpdate({ _id:userId },{isApproved:true},{  upsert: true, returnDocument: 'after' });
    return res.send({
      code: "00",
      user
    });
  } catch (err) {
    return res.status(500).send(ErrorCodes.U1);
  }
});


managerOpsRouter.post(
  "/taskByManagerId",
  isUserAuth,
  celebrate(
    {
      body: Joi.object({
        managerId: Joi.string().required(),
      }),
    },
    { abortEarly: false, allowUnknown: false }
  ),
  async (req, res) => {
    const { managerId } = req.body;
    try {
      const tasks = await Task.find({ managerId });
      return res.send({
        code: "00",
        tasks,
      });
    } catch (err) {
      return res.status(500).send(ErrorCodes.U1);
    }
  }
);

export default managerOpsRouter;
