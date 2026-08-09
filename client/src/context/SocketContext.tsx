import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { Vehicle } from "../types/vehicle";
import type { Alert } from "../types/alert";

import socket from "../socket/socket";

interface SocketContextType {
  liveVehicles: Vehicle[];
  alerts: Alert[];
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  liveVehicles: [],
  alerts: [],
  connected: false,
});

export function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [liveVehicles, setLiveVehicles] =
    useState<Vehicle[]>([]);

  const [alerts, setAlerts] =
    useState<Alert[]>([]);

  const [connected, setConnected] =
    useState(false);

  useEffect(() => {
    function onConnect() {
      console.log("🟢 Socket Connected");

      setConnected(true);

      socket.emit("client-ready");
    }

    function onDisconnect() {
      console.log("🔴 Socket Disconnected");

      setConnected(false);
    }

    function onVehicleUpdate(
      vehicles: Vehicle[],
    ) {
      if (!Array.isArray(vehicles)) {
        console.error(
          "Invalid vehicles payload:",
          vehicles,
        );
        return;
      }

      console.log(
        "🚚 Vehicles Received:",
        vehicles.length,
      );

      setLiveVehicles(vehicles);
    }

    function onAlertUpdate(
      incomingAlerts: Alert[],
    ) {
      if (!Array.isArray(incomingAlerts)) {
        console.error(
          "Invalid alerts payload:",
          incomingAlerts,
        );
        return;
      }

      console.log(
        "🚨 Alerts:",
        incomingAlerts,
      );

      setAlerts(incomingAlerts);
    }

    function onAny(
      event: string,
      ...args: unknown[]
    ) {
      console.log(
        "📡 Event:",
        event,
        args,
      );
    }

    socket.on("connect", onConnect);

    socket.on(
      "disconnect",
      onDisconnect,
    );

    socket.on(
      "vehicles-update",
      onVehicleUpdate,
    );

    socket.on(
      "alerts-update",
      onAlertUpdate,
    );

    socket.onAny(onAny);

    // Socket may already be connected
    // before SocketProvider mounts.
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off(
        "connect",
        onConnect,
      );

      socket.off(
        "disconnect",
        onDisconnect,
      );

      socket.off(
        "vehicles-update",
        onVehicleUpdate,
      );

      socket.off(
        "alerts-update",
        onAlertUpdate,
      );

      socket.offAny(onAny);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        liveVehicles,
        alerts,
        connected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}