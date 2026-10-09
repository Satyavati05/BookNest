
import { useEffect, useState } from "react";
import api from "../services/api";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/categories");
      setCategories(response.data.categories || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load categories. Please refresh the page."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function resetForm() {
    setName("");
    setDescription("");
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter a category name.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: trimmedName,
        description: description.trim(),
      };

      if (editingId !== null) {
        await api.put(
          `/categories/${editingId}`,
          payload,
          getAuthConfig()
        );
        setMessage("Category updated successfully!");
      } else {
        await api.post("/categories", payload, getAuthConfig());
        setMessage("Category added successfully!");
      }

      resetForm();
      await loadCategories();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to save category. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(category) {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || "");
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="page-container">
      <section className="page-header">
        <p className="eyebrow">BOOKNEST ADMIN</p>
        <h1>Manage Categories</h1>
        <p>
          Organize your library into genres so readers can discover
          their next favourite book.
        </p>
      </section>

      <section className="admin-form-section">
        <h2>{editingId !== null ? "Edit Category" : "Add a Category"}</h2>

        {message && <p role="status">{message}</p>}
        {error && <p role="alert">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category-name">Category name</label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Science Fiction"
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category-description">Description</label>
            <textarea
              id="category-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="A short description of this genre"
              rows={3}
            />
          </div>

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId !== null
                ? "Save Changes"
                : "Add Category"}
          </button>

          {editingId !== null && (
            <button type="button" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </form>
      </section>

      <section className="categories-section">
        <h2>Your Categories ({categories.length})</h2>

        {loading ? (
          <p>Loading categories...</p>
        ) : categories.length === 0 ? (
          <p>No categories yet. Add your first one above.</p>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <article className="category-card" key={category.id}>
                <h3>{category.name}</h3>
                <p>
                  {category.description || "No description added yet."}
                </p>
                <button
                  type="button"
                  onClick={() => handleEdit(category)}
                >
                  Edit Category
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminCategories;