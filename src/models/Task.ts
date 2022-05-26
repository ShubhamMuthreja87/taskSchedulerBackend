import mongoose from "mongoose";

export interface ITask {
  userId: string;
  managerId:string;
  name : string,
  description :string,
  deadLine: Date;
  buffer: number;
  length: number;
  week: number;
  done: boolean;
  forwardedTimes: number;
}

const task = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  managerId: {
    type: String,
    required: true,
  },
  deadLine: {
    type: Date,
    required: true
  },
  buffer: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  week: {
    type: Number,
  },
  done: {
    type: Boolean
  },
  forwardedTimes: {
    type: Number   
  },
});

export default mongoose.model<ITask & mongoose.Document>("task", task);
