import mongoose from "mongoose";

export interface IManager {
  name: string;
  email: string;
  phoneNo: number;
  password: string;
  userType :string;
}

const manager = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    index: true,
    required: true,
    dropDups: true,
  },
  phoneNo: {
    type: Number,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  userType:String
});

export default mongoose.model<IManager & mongoose.Document>(
  "Manager",
  manager
);
