import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaTruck } from "react-icons/fa";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.token, response.data.user, rememberMe);
      navigate("/", { replace: true });
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="logo-circle"><FaTruck aria-hidden="true" /></div>
        <h1 id="login-title">FleetDash</h1>
        <p className="subtitle">Sign in to continue monitoring your fleet.</p>

        <form onSubmit={handleLogin} noValidate>
          <div className="input-group">
            <label className="sr-only" htmlFor="login-email">Email address</label>
            <FaEnvelope className="input-icon" aria-hidden="true" />
            <input id="login-email" type="email" placeholder="Email address" value={email} autoComplete="email" required disabled={loading} aria-invalid={Boolean(error)} aria-describedby={error ? "login-error" : undefined} onChange={(event) => setEmail(event.target.value)} />
          </div>

          <div className="input-group">
            <label className="sr-only" htmlFor="login-password">Password</label>
            <FaLock className="input-icon" aria-hidden="true" />
            <input id="login-password" type={showPassword ? "text" : "password"} placeholder="Password" value={password} autoComplete="current-password" required disabled={loading} aria-invalid={Boolean(error)} aria-describedby={error ? "login-error" : undefined} onChange={(event) => setPassword(event.target.value)} />
            <button type="button" className="eye-btn" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
            </button>
          </div>

          <div className="login-options">
            <label><input type="checkbox" checked={rememberMe} disabled={loading} onChange={(event) => setRememberMe(event.target.checked)} />Remember me</label>
            <button type="button" className="forgot-btn" onClick={() => setError("Password reset is not configured yet. Please contact your administrator.")}>Forgot password?</button>
          </div>

          {error && <p id="login-error" className="login-error" role="alert">{error}</p>}
          <button type="submit" className="login-btn" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        </form>

        <p className="register-text">Don&apos;t have an account? <Link to="/register">Create account</Link></p>
      </section>
    </main>
  );
}

export default Login;
