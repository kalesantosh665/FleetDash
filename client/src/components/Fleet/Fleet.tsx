import api from "../../services/api";
import Charts from "../Charts/Charts";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Fleet.css";

interface Vehicle {
  _id: string;
  vehicleNo: string;
  driver: string;
  status: "Running" | "Stopped";
  speed: number;
  location: string;
}

function Fleet() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Default");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);

  const [addVehicle, setAddVehicle] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const vehiclesPerPage = 10;

  const [newVehicle, setNewVehicle] = useState<Vehicle>({
    _id: "",
    vehicleNo: "",
    driver: "",
    speed: 50,
    status: "Running",
    location: "",
  });

  const [deleteVehicle, setDeleteVehicle] = useState<Vehicle | null>(null);
  const fetchVehicles = async () => {
  try {
     setLoading(true);
    const response = await api.get("/vehicles");
    setVehicles(response.data.data);
  } catch (error) {
    console.error(error);
     toast.error("Failed to fetch vehicles");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.vehicleNo.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || vehicle.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  const sortedVehicles = [...filteredVehicles];

  switch (sortBy) {
    case "SpeedLow":
      sortedVehicles.sort((a, b) => a.speed - b.speed);
      break;

    case "SpeedHigh":
      sortedVehicles.sort((a, b) => b.speed - a.speed);
      break;

    case "NameAZ":
      sortedVehicles.sort((a, b) => a.vehicleNo.localeCompare(b.vehicleNo));
      break;

    case "NameZA":
      sortedVehicles.sort((a, b) => b.vehicleNo.localeCompare(a.vehicleNo));
      break;
  }
  
const totalVehicles = filteredVehicles.length;

const runningVehicles = filteredVehicles.filter(
  (v) => v.status === "Running"
).length;

const stoppedVehicles = filteredVehicles.filter(
  (v) => v.status === "Stopped"
).length;
 
  const averageSpeed =
    vehicles.length > 0
      ? Math.round(
          vehicles.reduce((sum, v) => sum + v.speed, 0) / vehicles.length,
        )
      : 0;
  // Pagination calculations
  const indexOfLastVehicle = currentPage * vehiclesPerPage;

  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;

  const currentVehicles = sortedVehicles.slice(
    indexOfFirstVehicle,
    indexOfLastVehicle,
  );

  const totalPages = Math.ceil(sortedVehicles.length / vehiclesPerPage);
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [sortedVehicles.length, totalPages, currentPage]);
 const exportToExcel = () => {
  const data = vehicles.map((vehicle) => ({
    "Vehicle No": vehicle.vehicleNo,
    Driver: vehicle.driver,
    Location: vehicle.location,
    Speed: `${vehicle.speed} km/h`,
    Status: vehicle.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Fleet");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(file, "Fleet_Report.xlsx");
  toast.success("Excel exported successfully");
};
const exportToPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Fleet Report", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [["Vehicle No", "Driver", "Location", "Speed", "Status"]],
    body: vehicles.map((vehicle) => [
      vehicle.vehicleNo,
      vehicle.driver,
      vehicle.location,
      `${vehicle.speed} km/h`,
      vehicle.status,
    ]),
  });

  doc.save("Fleet_Report.pdf");

  toast.success("PDF exported successfully");
};
  if (loading) {

 return (
    <div className="loading-container">
       <div className="loader"></div>
      <p>Loading Vehicles...</p>
    </div>
  );
}
  return (
    <div className="fleet-page">
      <h1>🚚 Fleet Management</h1>

      <div className="fleet-header">
        <button
        
          className="add-btn"
          onClick={() => {
            setNewVehicle({
  _id: "",
  vehicleNo: "",
  driver: "",
  speed: 50,
  status: "Running",
  location: "",
});

            setAddVehicle(true);
          }}
        >
          
          ➕ Add Vehicle 
        </button>
        <button
  className="export-btn"
  onClick={exportToExcel}
>
  📊 Export Excel
</button>
<button
  className="pdf-btn"
  onClick={exportToPDF}
>
  📄 Export PDF
</button>
      </div>
      
      

      <p className="fleet-subtitle">Monitor and manage all fleet vehicles.</p>

      {/* 👇 Statistics Cards */}

      <div className="fleet-stats">
        <div className="stat-card">
          <h3>{totalVehicles}</h3>
          <p>Total Vehicles</p>
        </div>

        <div className="stat-card">
          <h3>{runningVehicles}</h3>
          <p>Running</p>
        </div>

        <div className="stat-card">
          <h3>{stoppedVehicles}</h3>
          <p>Stopped</p>
        </div>

        <div className="stat-card">
          <h3>{averageSpeed} km/h</h3>
          <p>Average Speed</p>
        </div>
      </div>

      <Charts
        stats={{
          totalVehicles,
          runningVehicles,
          stoppedVehicles,
          averageSpeed,
        }}
      />

      {/* Search & Filter */}

      <div className="fleet-toolbar">
        <input
          type="text"
          placeholder="Search Vehicle or Driver..."
          className="fleet-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="fleet-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Running</option>
          <option>Stopped</option>
        </select>
        <select
          className="fleet-filter"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="Default">Sort By</option>
          <option value="SpeedLow">Speed ↑</option>
          <option value="SpeedHigh">Speed ↓</option>
          <option value="NameAZ">Vehicle A-Z</option>
          <option value="NameZA">Vehicle Z-A</option>
        </select>
      </div>
         
      {/* Table */}

      <div className="fleet-table-card">
        <table className="fleet-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Speed</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentVehicles.map((vehicle) => (
              <tr key={vehicle._id}>
                <td>{vehicle.vehicleNo}</td>

                <td>{vehicle.vehicleNo}</td>

                <td>{vehicle.driver}</td>

                <td>{vehicle.speed} km/h</td>

               <td>
  <span
    className={
      vehicle.status === "Running"
        ? "status-badge running"
        : "status-badge stopped"
    }
  >
    {vehicle.status}
  </span>
</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      👁️ View
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() => setEditVehicle({ ...vehicle })}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => setDeleteVehicle(vehicle)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredVehicles.length === 0 && (
          <div className="no-data">🚚 No vehicle found.</div>
        )}
      </div>

      {/* View Modal */}

      {selectedVehicle && (
        <div className="modal-overlay" onClick={() => setSelectedVehicle(null)}>
          <div className="vehicle-modal" onClick={(e) => e.stopPropagation()}>
            <h2>🚚 Vehicle Details</h2>

            <p>
              
  <strong>Vehicle No :</strong> {selectedVehicle.vehicleNo}

            </p>

            <p>
              <strong>Vehicle :</strong> {selectedVehicle.vehicleNo}
            </p>

            <p>
              <strong>Driver :</strong> {selectedVehicle.driver}
            </p>
<p>
  <strong>Location :</strong> {selectedVehicle.location}
</p>
            <p>
              <strong>Speed :</strong> {selectedVehicle.speed} km/h
            </p>

            <p>
              <strong>Status :</strong>{" "}
              <span
                className={
                  selectedVehicle.status === "Running" ? "running" : "stopped"
                }
              >
                {selectedVehicle.status}
              </span>
            </p>

            <button
              className="close-btn"
              onClick={() => setSelectedVehicle(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}

      {editVehicle && (
        <div className="modal-overlay" onClick={() => setEditVehicle(null)}>
          <div className="vehicle-modal" onClick={(e) => e.stopPropagation()}>
            <h2>✏️ Edit Vehicle</h2>

            <label>Vehicle</label>

            <input
              type="text"
              value={editVehicle.vehicleNo}
              onChange={(e) =>
                setEditVehicle({
                  ...editVehicle,
                  vehicleNo: e.target.value,
                })
              }
            />

            <label>Driver</label>

            <input
              type="text"
              value={editVehicle.driver}
              onChange={(e) =>
                setEditVehicle({
                  ...editVehicle,
                  driver: e.target.value,
                })
              }
            />
              <label>Location</label>

<input
  type="text"
  value={editVehicle.location}
  onChange={(e) =>
    setEditVehicle({
      ...editVehicle,
      location: e.target.value,
    })
  }
/>
            <label>Speed</label>

            <input
              type="number"
              value={editVehicle.speed}
              onChange={(e) =>
                setEditVehicle({
                  ...editVehicle,
                  speed: Number(e.target.value),
                })
              }
            />

            <label>Status</label>

            <select
              value={editVehicle.status}
              onChange={(e) =>
                setEditVehicle({
                  ...editVehicle,
                  status: e.target.value as "Running" | "Stopped"
                })
              }
            >
              <option>Running</option>
              <option>Stopped</option>
            </select>

            <div className="modal-buttons">
             <button
  className="save-btn"
  onClick={async () => {
    try {
      await api.put(`/vehicles/${editVehicle!._id}`, {
        vehicleNo: editVehicle!.vehicleNo,
        driver: editVehicle!.driver,
        location: editVehicle!.location,
        
        speed: editVehicle!.speed,
        status: editVehicle!.status,
      });
         toast.success("Vehicle updated successfully");
      setVehicles((prev) =>
        prev.map((v) =>
          v._id === editVehicle!._id ? editVehicle! : v
        )
      );

      setEditVehicle(null);
    } catch (error) {
      console.error(error);
    }
  }}
>
  💾 Save
</button>

              <button
                className="close-btn"
                onClick={() => setEditVehicle(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          ◀️ Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next ▶️
        </button>
      </div>
      {/* Delete Modal */}

      {deleteVehicle && (
        <div className="modal-overlay" onClick={() => setDeleteVehicle(null)}>
          <div className="vehicle-modal" onClick={(e) => e.stopPropagation()}>
            <h2>🗑️ Delete Vehicle</h2>

            <p
              style={{
                margin: "20px 0",
                textAlign: "center",
                fontSize: "18px",
              }}
            >
              Are you sure you want to delete
              <br />
              <strong>{deleteVehicle.vehicleNo}</strong> ?
            </p>

            <div className="modal-buttons">
              <button
                className="close-btn"
                onClick={() => setDeleteVehicle(null)}
              >
                Cancel
              </button>

              <button
                className="delete-btn"
                onClick={async () => {
  try {
    await api.delete(`/vehicles/${deleteVehicle._id}`);
     toast.success("Vehicle deleted successfully");
    setVehicles((prev) =>
      prev.filter((v) => v._id !== deleteVehicle._id)
    );

    setDeleteVehicle(null);
  } catch (error) {
    console.error(error);
  }
}}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Vehicle Modal */}

      {addVehicle && (
        <div className="modal-overlay" onClick={() => setAddVehicle(false)}>
          <div className="vehicle-modal" onClick={(e) => e.stopPropagation()}>
             <h2>➕ Add Vehicle</h2>
            <div className="modal-content">
  <input
    type="text"
    placeholder="Vehicle Number"
    value={newVehicle.vehicleNo}
    onChange={(e) =>
      setNewVehicle({ ...newVehicle, vehicleNo: e.target.value })
    }
  />

  <input
    type="text"
    placeholder="Driver Name"
    value={newVehicle.driver}
    onChange={(e) =>
      setNewVehicle({ ...newVehicle, driver: e.target.value })
    }
  />

  <input
    type="text"
    placeholder="Location"
    value={newVehicle.location}
    onChange={(e) =>
      setNewVehicle({ ...newVehicle, location: e.target.value })
    }
  />

  <input
    type="number"
    placeholder="Speed"
    value={newVehicle.speed}
    onChange={(e) =>
      setNewVehicle({
        ...newVehicle,
        speed: Number(e.target.value),
      })
    }
  />

  <select
    value={newVehicle.status}
    onChange={(e) =>
      setNewVehicle({ ...newVehicle, status: e.target.value as "Running" | "Stopped" })
    }
  >
    <option value="Running">Running</option>
    <option value="Stopped">Stopped</option>
  </select>
</div>
            <div className="modal-buttons">
              <button
                className="save-btn"
                onClick={async () => {
                   if (
      !newVehicle.vehicleNo.trim() ||
      !newVehicle.driver.trim() ||
      !newVehicle.location.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
                  try {
                    const response = await api.post("/vehicles", {
                      vehicleNo: newVehicle.vehicleNo,
                      driver: newVehicle.driver,
                      location: newVehicle.location,
                      speed: newVehicle.speed,
                      status: newVehicle.status,
                    });
                    toast.success("Vehicle added successfully");
                    setVehicles((prev) => [...prev, response.data.data]);

                    setCurrentPage(
                      Math.ceil((vehicles.length + 1) / vehiclesPerPage),
                    );

                    setNewVehicle({
                      _id: "",
                      vehicleNo: "",
                      driver: "",
                      location: "",
                      speed: 50,
                      status: "Running",
                    });

                    setAddVehicle(false);
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                💾 Save
              </button>

              <button
                className="close-btn"
                onClick={() => setAddVehicle(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fleet;
