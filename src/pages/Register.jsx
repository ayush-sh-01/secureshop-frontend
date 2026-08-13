import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form.name, form.username, form.email, form.password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object" && !data.message) {
        // Field-level validation errors from the backend (Map<String,String>)
        setError(Object.values(data).join(", "));
      } else {
        setError(data?.message || "Registration failed");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        <p className="auth-subtitle">Register a new SecureShop account</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">Account created! Redirecting to login...</div>}

        <label>Full name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Username</label>
        <input name="username" value={form.username} onChange={handleChange} required />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required />

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Creating..." : "Register"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
