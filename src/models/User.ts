import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  phoneNo: number;
  password: string;
  managerId: string;
  isApproved: boolean;
  workHrs: number;
  userType: string;
}

const user = new mongoose.Schema({
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

  managerId: {
    type: String,
    required: true,
  },
  isApproved: Boolean,
  workHrs: { type: Number, required: true },
  userType: String,
});

export default mongoose.model<IUser & mongoose.Document>("User", user);
