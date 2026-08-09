import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "driver";
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type:String,
      required:true,
      unique:true,
      lowercase:true,
    },

    password:{
      type:String,
      required:true,
    },

    role:{
      type:String,
      enum:["admin","driver"],
      default:"driver",
    },
  },
  {
    timestamps:true,
  }
);

export default mongoose.model<IUser>(
  "User",
  userSchema
);