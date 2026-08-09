import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

function Profile() {
  const { user } = useAuth();

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-header">

          <FaUserCircle className="profile-avatar" />

          <h2>{user?.name}</h2>

          <p>Fleet Manager</p>

        </div>

        <div className="profile-body">

          <div className="profile-row">
            <span>Name</span>
            <strong>{user?.name}</strong>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <strong>{user?.email}</strong>
          </div>

          <div className="profile-row">
            <span>Role</span>
            <strong>Fleet Manager</strong>
          </div>

          <div className="profile-row">
            <span>Phone</span>
            <strong>+91 9876543210</strong>
          </div>

          <div className="profile-row">
            <span>Location</span>
            <strong>Pune, Maharashtra</strong>
          </div>

          <div className="profile-row">
            <span>Joined</span>
            <strong>July 2026</strong>
          </div>

        </div>

        <div className="profile-buttons">

          <button className="edit-btn">
            ✏ Edit Profile
          </button>

          <button className="password-btn">
            🔒 Change Password
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;