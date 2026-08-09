import {
  createVehicles,
  moveVehicles,
} from "../services/vehicle.service";

async function startWorker() {
  createVehicles();

  console.log("🚛 Vehicle Worker Started");

  setInterval(async () => {
    await moveVehicles();
  }, 1000);
}

startWorker();