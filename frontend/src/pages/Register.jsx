
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
});

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/auth/register", {
                username: formData.username.trim(),
                full_name: formData.full_name.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });

            setSuccess("Account created successfully! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <section className="auth-card">
                <p className="eyebrow">YOUR READING JOURNEY BEGINS</p>
                <h1>Create your account</h1>
                <p className="auth-description">
                    Join BookNest to discover books and keep your reading
                    journey organised.
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div>
                        <label htmlFor="full_name">Full name</label>
                        <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.full_name}
                        onChange={handleChange}
                        autoComplete="name"
                        required
                        />
                        </div>
                        <div>
                            <label htmlFor="username">Username</label>
                            <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="username"
                            required
                            />
                            </div>

                    <div>
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="At least 8 characters"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            minLength={8}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Enter your password again"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    {error && (
                        <p className="auth-message auth-error" role="alert">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="auth-message auth-success" role="status">
                            {success}
                        </p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </section>
        </div>
    );
}

export default Register;