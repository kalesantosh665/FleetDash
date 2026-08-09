import mongoose, { Schema, Document } from "mongoose";

export interface IVehicle extends Document {
  id: number;
  name: string;
  driver: string;

  lat: number;
  lng: number;

  speed: number;
  status: "Running" | "Stopped";

  fuel: number;
  battery: number;

  route: [number, number][];
}

const VehicleSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    driver: {
      type: String,
      required: true,
    },

    lat: {
      type: Number,
      default: 18.5204,
    },

    lng: {
      type: Number,
      default: 73.8567,
    },

    speed: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Running", "Stopped"],
      default: "Stopped",
    },

    fuel: {
      type: Number,
      default: 100,
    },

    battery: {
      type: Number,
      default: 100,
    },

    route: {
      type: [[Number]],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IVehicle>(
  "Vehicle",
  VehicleSchema
);