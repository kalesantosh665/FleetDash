import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import toast from "react-hot-toast";

import api from "../../services/api";
import Charts from "../Charts/Charts";
import { useSocket } from "../../context/SocketContext";

import "./Fleet.css";

type Status = "Running" | "Stopped";

interface Vehicle {
  _id: string;
  id: number;
  name: string;
  driver: string;
  lat: number;
  lng: number;
  speed: number;
  status: Status;
  fuel: number;
  battery: number;
  route: [number, number][];
}

interface RawVehicle extends Partial<Vehicle> {
  vehicleNo?: string;
  location?: string;
}

type VehicleDraft = Omit<Vehicle, "_id" | "route">;

const emptyDraft = (): VehicleDraft => ({
  id: 0,
  name: "",
  driver: "",
  lat: 18.5204,
  lng: 73.8567,
  speed: 0,
  status: "Stopped",
  fuel: 100,
  battery: 100,
});

const numberOr = (
  value: unknown,
  fallback: number,
) =>
  typeof value === "number" && Number.isFinite(value)
    ? value
    : fallback;

/**
 * Supports legacy API data while the backend
 * migrates from vehicleNo/location to name/lat/lng.
 */
function normalizeVehicle(
  raw: RawVehicle,
  index: number,
): Vehicle {
  return {
    _id: raw._id ?? `legacy-${index}`,
    id: numberOr(raw.id, index + 1),
    name:
      raw.name?.trim() ||
      raw.vehicleNo?.trim() ||
      `Vehicle ${index + 1}`,
    driver: raw.driver?.trim() || "Unassigned",
    lat: numberOr(raw.lat, 18.5204),
    lng: numberOr(raw.lng, 73.8567),
    speed: numberOr(raw.speed, 0),
    status:
      raw.status === "Running"
        ? "Running"
        : "Stopped",
    fuel: numberOr(raw.fuel, 100),
    battery: numberOr(raw.battery, 100),
    route: Array.isArray(raw.route)
      ? raw.route
      : [],
  };
}

function Fleet() {
  /*
   * MongoDB vehicles = persistent fleet registry
   * liveVehicles = Socket.io real-time telemetry
   */
  const {
    liveVehicles,
    connected,
  } = useSocket();

  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [query, setQuery] =
    useState("");

  const [status, setStatus] =
    useState<"All" | Status>("All");

  const [loading, setLoading] =
    useState(true);

  const [editing, setEditing] =
    useState<Vehicle | null>(null);

  const [creating, setCreating] =
    useState(false);

  const [draft, setDraft] =
    useState<VehicleDraft>(emptyDraft());

  /*
   * --------------------------------------------------
   * LOAD PERSISTENT VEHICLES FROM MONGODB
   * --------------------------------------------------
   */
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response =
          await api.get("/vehicles");

        const rawVehicles =
          Array.isArray(response.data.data)
            ? (response.data.data as RawVehicle[])
            : [];

        if (active) {
          setVehicles(
            rawVehicles.map(normalizeVehicle),
          );
        }
      } catch {
        toast.error(
          "Failed to load fleet vehicles",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

 /*
 * --------------------------------------------------
 * MERGE MONGODB + SOCKET.IO VEHICLES
 * --------------------------------------------------
 *
 * MongoDB provides persistent vehicle information.
 * Socket.io provides real-time telemetry.
 *
 * Socket vehicles are also added when they are not
 * present in MongoDB, so Fleet page stays in sync
 * with Dashboard / Live Map.
 */
useEffect(() => {
  if (!liveVehicles.length) {
    return;
  }

  setVehicles((currentVehicles) => {
    const mongoById = new Map(
      currentVehicles.map((vehicle) => [
        vehicle.id,
        vehicle,
      ]),
    );

    return liveVehicles.map((liveVehicle) => {
      const existingVehicle =
        mongoById.get(liveVehicle.id);

      if (existingVehicle) {
        return {
          ...existingVehicle,

          lat: liveVehicle.lat,
          lng: liveVehicle.lng,
          speed: liveVehicle.speed,
          status: liveVehicle.status,

          fuel:
            liveVehicle.fuel ??
            existingVehicle.fuel,

          battery:
            liveVehicle.battery ??
            existingVehicle.battery,
        };
      }

      return {
        _id: `live-${liveVehicle.id}`,
        id: liveVehicle.id,
        name:
          liveVehicle.name ||
          `Vehicle ${liveVehicle.id}`,
        driver:
          liveVehicle.driver ||
          "Unassigned",

        lat: liveVehicle.lat,
        lng: liveVehicle.lng,
        speed: liveVehicle.speed,
        status: liveVehicle.status,

        fuel: liveVehicle.fuel ?? 100,
        battery: liveVehicle.battery ?? 100,

        route:
          Array.isArray(liveVehicle.route)
            ? liveVehicle.route
            : [],
      };
    });
  });
}, [liveVehicles]);

  /*
   * --------------------------------------------------
   * SEARCH + STATUS FILTER
   * --------------------------------------------------
   */
  const filtered = useMemo(
    () =>
      vehicles.filter(
        (vehicle) =>
          (status === "All" ||
            vehicle.status === status) &&
          [
            vehicle.name,
            vehicle.driver,
            String(vehicle.id),
          ].some((value) =>
            value
              .toLowerCase()
              .includes(
                query.trim().toLowerCase(),
              ),
          ),
      ),
    [vehicles, query, status],
  );

  /*
   * --------------------------------------------------
   * LIVE FLEET STATS
   * --------------------------------------------------
   */
  const stats = useMemo(() => {
    const runningVehicles =
      vehicles.filter(
        (vehicle) =>
          vehicle.status === "Running",
      ).length;

    const totalVehicles =
      vehicles.length;

    return {
      totalVehicles,

      runningVehicles,

      stoppedVehicles:
        totalVehicles -
        runningVehicles,

      averageSpeed: totalVehicles
        ? Math.round(
            vehicles.reduce(
              (sum, vehicle) =>
                sum + vehicle.speed,
              0,
            ) / totalVehicles,
          )
        : 0,
    };
  }, [vehicles]);

  /*
   * --------------------------------------------------
   * UPDATE FORM FIELD
   * --------------------------------------------------
   */
  const updateDraft = (
    key: keyof VehicleDraft,
    value: string | number | Status,
  ) =>
    setDraft(
      (current) =>
        ({
          ...current,
          [key]: value,
        }) as VehicleDraft,
    );

  /*
   * --------------------------------------------------
   * CREATE / UPDATE VEHICLE
   * --------------------------------------------------
   */
  const save = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    try {
      /*
       * UPDATE EXISTING VEHICLE
       */
      if (editing) {
        const response =
          await api.put(
            `/vehicles/${editing._id}`,
            draft,
          );

        const updated =
          normalizeVehicle(
            response.data.data as RawVehicle,
            0,
          );

        setVehicles((current) =>
          current.map((item) =>
            item._id === editing._id
              ? updated
              : item,
          ),
        );

        toast.success(
          "Vehicle updated",
        );
      }

      /*
       * CREATE NEW VEHICLE
       */
      else {
        const response =
          await api.post(
            "/vehicles",
            draft,
          );

        setVehicles((current) => [
          ...current,

          normalizeVehicle(
            response.data.data as RawVehicle,
            current.length,
          ),
        ]);

        toast.success(
          "Vehicle added",
        );
      }

      setEditing(null);
      setCreating(false);
    } catch {
      toast.error(
        "Unable to save vehicle. Check all fields.",
      );
    }
  };

  /*
   * --------------------------------------------------
   * DELETE VEHICLE
   * --------------------------------------------------
   */
  const remove = async (
    vehicle: Vehicle,
  ) => {
    if (
      !window.confirm(
        `Delete ${vehicle.name}?`,
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/vehicles/${vehicle._id}`,
      );

      setVehicles((current) =>
        current.filter(
          (item) =>
            item._id !== vehicle._id,
        ),
      );

      toast.success(
        "Vehicle deleted",
      );
    } catch {
      toast.error(
        "Unable to delete vehicle",
      );
    }
  };

  /*
   * --------------------------------------------------
   * OPEN CREATE MODAL
   * --------------------------------------------------
   */
  const openCreate = () => {
    setDraft(emptyDraft());
    setCreating(true);
  };

  /*
   * --------------------------------------------------
   * OPEN EDIT MODAL
   * --------------------------------------------------
   */
  const openEdit = (
    vehicle: Vehicle,
  ) => {
    const {
      _id,
      route,
      ...nextDraft
    } = vehicle;

    setDraft(nextDraft);
    setEditing(vehicle);
  };

  /*
   * --------------------------------------------------
   * LOADING STATE
   * --------------------------------------------------
   */
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader" />

        <p>
          Loading vehicles...
        </p>
      </div>
    );
  }

  /*
   * --------------------------------------------------
   * UI
   * --------------------------------------------------
   */
  return (
    <main className="fleet-page">

      {/* HEADER */}
      <header className="fleet-header">
        <div>
          <h1>
            Fleet Management
          </h1>

          <p className="fleet-subtitle">
            Manage the persistent vehicle
            registry.
          </p>
        </div>

        <button
          className="add-btn"
          onClick={openCreate}
        >
          Add vehicle
        </button>
      </header>

      {/* SOCKET CONNECTION STATUS */}
      <div
        style={{
          marginBottom: "16px",
          color: connected
            ? "#15803d"
            : "#b91c1c",
          fontWeight: 700,
        }}
      >
        ●{" "}
        {connected
          ? "Live Data Connected"
          : "Live Data Disconnected"}
      </div>

      {/* STATS */}
      <section className="fleet-stats">

        <div className="stat-card">
          <h3>
            {stats.totalVehicles}
          </h3>

          <p>
            Total
          </p>
        </div>

        <div className="stat-card">
          <h3>
            {stats.runningVehicles}
          </h3>

          <p>
            Running
          </p>
        </div>

        <div className="stat-card">
          <h3>
            {stats.stoppedVehicles}
          </h3>

          <p>
            Stopped
          </p>
        </div>

        <div className="stat-card">
          <h3>
            {stats.averageSpeed} km/h
          </h3>

          <p>
            Average speed
          </p>
        </div>

      </section>

      {/* CHARTS */}
      <Charts stats={stats} />

      {/* SEARCH + FILTER */}
      <div className="fleet-toolbar">

        <input
          className="fleet-search"
          value={query}
          placeholder="Search vehicle, driver, or ID"
          onChange={(event) =>
            setQuery(
              event.target.value,
            )
          }
        />

        <select
          className="fleet-filter"
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as
                | "All"
                | Status,
            )
          }
        >
          <option value="All">
            All statuses
          </option>

          <option value="Running">
            Running
          </option>

          <option value="Stopped">
            Stopped
          </option>
        </select>

      </div>

      {/* VEHICLE TABLE */}
      <section className="fleet-table-card">

        <table className="fleet-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Location</th>
              <th>Speed</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map(
              (vehicle) => (
                <tr
                  key={vehicle._id}
                >

                  <td>
                    {vehicle.id}
                  </td>

                  <td>
                    {vehicle.name}
                  </td>

                  <td>
                    {vehicle.driver}
                  </td>

                  <td>
                    {vehicle.lat.toFixed(4)}
                    ,{" "}
                    {vehicle.lng.toFixed(4)}
                  </td>

                  <td>
                    {vehicle.speed} km/h
                  </td>

                  <td>
                    <span
                      className={`status-badge ${
                        vehicle.status ===
                        "Running"
                          ? "running"
                          : "stopped"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </td>

                  <td className="action-buttons">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        openEdit(
                          vehicle,
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        void remove(
                          vehicle,
                        )
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ),
            )}

          </tbody>

        </table>

        {!filtered.length && (
          <p className="no-data">
            No matching vehicles.
          </p>
        )}

      </section>

      {/* CREATE / EDIT MODAL */}
      {(creating || editing) && (
        <div
          className="modal-overlay"
          onClick={() => {
            setCreating(false);
            setEditing(null);
          }}
        >

          <form
            className="vehicle-modal"
            onSubmit={save}
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <h2>
              {editing
                ? "Edit vehicle"
                : "Add vehicle"}
            </h2>

            <div className="modal-content">

              {(
                [
                  [
                    "id",
                    "Vehicle ID",
                    "number",
                  ],
                  [
                    "name",
                    "Vehicle name",
                    "text",
                  ],
                  [
                    "driver",
                    "Driver",
                    "text",
                  ],
                  [
                    "lat",
                    "Latitude",
                    "number",
                  ],
                  [
                    "lng",
                    "Longitude",
                    "number",
                  ],
                  [
                    "speed",
                    "Speed",
                    "number",
                  ],
                  [
                    "fuel",
                    "Fuel (%)",
                    "number",
                  ],
                  [
                    "battery",
                    "Battery (%)",
                    "number",
                  ],
                ] as const
              ).map(
                ([
                  key,
                  label,
                  type,
                ]) => (
                  <label
                    key={key}
                  >

                    {label}

                    <input
                      type={type}
                      required
                      value={
                        draft[key]
                      }
                      onChange={(
                        event,
                      ) =>
                        updateDraft(
                          key,
                          type ===
                            "number"
                            ? Number(
                                event
                                  .target
                                  .value,
                              )
                            : event
                                .target
                                .value,
                        )
                      }
                    />

                  </label>
                ),
              )}

              <label>
                Status

                <select
                  value={
                    draft.status
                  }
                  onChange={(
                    event,
                  ) =>
                    updateDraft(
                      "status",
                      event.target
                        .value as Status,
                    )
                  }
                >
                  <option value="Running">
                    Running
                  </option>

                  <option value="Stopped">
                    Stopped
                  </option>
                </select>

              </label>

            </div>

            <div className="modal-buttons">

              <button
                className="save-btn"
                type="submit"
              >
                Save
              </button>

              <button
                className="close-btn"
                type="button"
                onClick={() => {
                  setCreating(false);
                  setEditing(null);
                }}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

    </main>
  );
}

export default Fleet;