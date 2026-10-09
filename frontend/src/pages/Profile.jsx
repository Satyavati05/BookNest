
import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
    const [user, setUser] = useState(null);

    const [form, setForm] = useState({
        full_name: "",
        username: "",
        email: ""
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [editing, setEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    };

    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await api.get("/profile", authConfig);
                const profile = response.data.user;

                setUser(profile);
                setForm({
                    full_name: profile.full_name || "",
                    username: profile.username || "",
                    email: profile.email || ""
                });
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load your profile."
                );
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    }

    function handlePasswordInput(event) {
        const { name, value } = event.target;

        setPasswordForm((previous) => ({
            ...previous,
            [name]: value
        }));
    }

    async function handleSave(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        try {
            setSaving(true);

            const response = await api.put(
                "/profile",
                form,
                authConfig
            );

            const updatedUser = response.data.user;

            setUser(updatedUser);
            setForm({
                full_name: updatedUser.full_name || "",
                username: updatedUser.username || "",
                email: updatedUser.email || ""
            });

            setEditing(false);
            setMessage("Your profile has been updated successfully.");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update your profile."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handlePasswordChange(event) {
        event.preventDefault();
        setPasswordError("");
        setPasswordMessage("");

        if (passwordForm.newPassword.length < 8) {
            setPasswordError(
                "Your new password must be at least 8 characters."
            );
            return;
        }

        if (
            passwordForm.newPassword !== passwordForm.confirmPassword
        ) {
            setPasswordError("Your new passwords do not match.");
            return;
        }

        try {
            setChangingPassword(true);

            const response = await api.put(
                "/profile/password",
                {
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                },
                authConfig
            );

            setPasswordMessage(
                response.data.message || "Password changed successfully."
            );

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            setShowPasswordForm(false);
        } catch (err) {
            setPasswordError(
                err.response?.data?.message ||
                "Unable to change your password."
            );
        } finally {
            setChangingPassword(false);
        }
    }

    function cancelProfileEdit() {
        setForm({
            full_name: user.full_name || "",
            username: user.username || "",
            email: user.email || ""
        });

        setEditing(false);
        setError("");
        setMessage("");
    }

    function cancelPasswordEdit() {
        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });

        setShowPasswordForm(false);
        setPasswordError("");
        setPasswordMessage("");
    }

    if (loading) {
        return <p>Loading your profile...</p>;
    }

    if (!user) {
        return (
            <section className="profile-page">
                <h1>My Profile</h1>
                <p role="alert">{error || "Profile not found."}</p>
            </section>
        );
    }

    return (
        <section className="profile-page">
            <p className="eyebrow">YOUR ACCOUNT</p>
            <h1>My Profile</h1>
            <p>Manage your personal information and account security.</p>

            {message && <p role="status">{message}</p>}
            {error && <p role="alert">{error}</p>}

            {editing ? (
                <form className="profile-card" onSubmit={handleSave}>
                    <h2>Edit Profile</h2>

                    <label htmlFor="full_name">Full name</label>
                    <input
                        id="full_name"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        autoComplete="name"
                        required
                    />

                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        autoComplete="username"
                        required
                    />

                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />

                    <button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                        type="button"
                        onClick={cancelProfileEdit}
                        disabled={saving}
                    >
                        Cancel
                    </button>
                </form>
            ) : (
                <div className="profile-card">
                    <h2>Personal Information</h2>

                    <p>
                        <strong>Full name:</strong> {user.full_name}
                    </p>
                    <p>
                        <strong>Username:</strong> {user.username}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            setError("");
                            setMessage("");
                            setEditing(true);
                        }}
                    >
                        Edit Profile
                    </button>
                </div>
            )}

            <div className="profile-card password-section">
                <h2>Security</h2>
                <p>Keep your BookNest account secure by updating your password.</p>

                {passwordMessage && (
                    <p role="status">{passwordMessage}</p>
                )}

                {passwordError && (
                    <p role="alert">{passwordError}</p>
                )}

                {!showPasswordForm ? (
                    <button
                        type="button"
                        onClick={() => {
                            setPasswordError("");
                            setPasswordMessage("");
                            setShowPasswordForm(true);
                        }}
                    >
                        Change Password
                    </button>
                ) : (
                    <form onSubmit={handlePasswordChange}>
                        <label htmlFor="currentPassword">
                            Current password
                        </label>
                        <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            autoComplete="current-password"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordInput}
                            required
                        />

                        <label htmlFor="newPassword">
                            New password
                        </label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            value={passwordForm.newPassword}
                            onChange={handlePasswordInput}
                            required
                        />

                        <label htmlFor="confirmPassword">
                            Confirm new password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordInput}
                            required
                        />

                        <button
                            type="submit"
                            disabled={changingPassword}
                        >
                            {changingPassword
                                ? "Updating..."
                                : "Update Password"}
                        </button>

                        <button
                            type="button"
                            onClick={cancelPasswordEdit}
                            disabled={changingPassword}
                        >
                            Cancel
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}

export default Profile;