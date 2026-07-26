import mongoose, { Schema, Document } from "mongoose";

export interface IVehicle extends Document {
  vehicleNo: string;
  driver: string;
  status: "Running" | "Stopped";
  speed: number;
  location: string;
}

const VehicleSchema = new Schema(
  {
    vehicleNo: {
      type: String,
      required: true,
      unique: true,
    },
    driver: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Running", "Stopped"],
      default: "Stopped",
    },
    speed: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      default: "Unknown",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IVehicle>("Vehicle", VehicleSchema);