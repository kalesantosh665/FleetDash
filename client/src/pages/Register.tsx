import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  
  FaUser,
} from "react-icons/fa";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });
      login(response.data.token, response.data.user, true);
      navigate("/", { replace: true });
    } catch (error) {
      const message =
        error instanceof AxiosError ? error.response?.data?.message : undefined;
      setError(message || "Unable to create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-card" aria-labelledby="register-title">
         <div className="login-logo">
  <img src="/logo.png" alt="FleetDash" />
</div>

<h1 className="login-brand">
  <span className="fleet-text">Fleet</span>
  <span className="dash-text">Dash</span>
</h1>
        
        <p className="subtitle">Create your account</p>
        <form onSubmit={submit} noValidate>
          <div className="input-group">
            <label className="sr-only" htmlFor="register-name">
              Full name
            </label>
            <FaUser className="input-icon" aria-hidden="true" />
            <input
              id="register-name"
              value={name}
              placeholder="Full name"
              autoComplete="name"
              required
              disabled={loading}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="sr-only" htmlFor="register-email">
              Email address
            </label>
            <FaEnvelope className="input-icon" aria-hidden="true" />
            <input
              id="register-email"
              type="email"
              value={email}
              placeholder="Email address"
              autoComplete="email"
              required
              disabled={loading}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="sr-only" htmlFor="register-password">
              Password
            </label>
            <FaLock className="input-icon" aria-hidden="true" />
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Password"
              autoComplete="new-password"
              required
              disabled={loading}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="eye-btn"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="input-group">
            <label className="sr-only" htmlFor="register-confirm-password">
              Confirm password
            </label>
            <FaLock className="input-icon" aria-hidden="true" />
            <input
              id="register-confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              placeholder="Confirm password"
              autoComplete="new-password"
              required
              disabled={loading}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
          {error && (
            <p className="register-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="login-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
