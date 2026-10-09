import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  title: "",
  author: "",
  isbn: "",
  description: "",
  cover_image_url: "",
  publication_year: "",
  category_id: "",
};

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [booksResponse, categoriesResponse] = await Promise.all([
        api.get("/books", { params: { limit: 100 } }),
        api.get("/categories"),
      ]);

      setBooks(booksResponse.data.books || []);
      setCategories(categoriesResponse.data.categories || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load books and categories."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  }

  function startEditing(book) {
    setForm({
      title: book.title || "",
      author: book.author || "",
      isbn: book.isbn || "",
      description: book.description || "",
      cover_image_url: book.cover_image_url || "",
      publication_year: book.publication_year?.toString() || "",
      category_id: book.category_id?.toString() || "",
    });

    setEditingId(book.id);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title.trim() || !form.author.trim()) {
      setError("Title and author are required.");
      return;
    }

    if (!form.category_id) {
      setError("Please select a category.");
      return;
    }

    const year = Number(form.publication_year);

    if (
      form.publication_year &&
      (!Number.isInteger(year) || year < 1 || year > 9999)
    ) {
      setError("Enter a valid publication year.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim(),
      description: form.description.trim(),
      cover_image_url: form.cover_image_url.trim(),
      publication_year: form.publication_year ? year : null,
      category_id: Number(form.category_id),
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await api.put(
          `/books/${editingId}`,
          payload,
          getAuthConfig()
        );
        setMessage("Book updated successfully!");
      } else {
        await api.post("/books", payload, getAuthConfig());
        setMessage("Book added successfully!");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save the book. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(book) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.title}"?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await api.delete(`/books/${book.id}`, getAuthConfig());

      setBooks((previous) =>
        previous.filter((item) => item.id !== book.id)
      );

      if (editingId === book.id) {
        resetForm();
      }

      setMessage("Book deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not delete the book."
      );
    }
  }

  const filteredBooks = books.filter((book) => {
    const query = search.trim().toLowerCase();

    return (
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.isbn?.toLowerCase().includes(query)
    );
  });

  return (
    <main className="page-container admin-books-page">
      <section className="admin-books-header">
        <p className="eyebrow">BOOKNEST ADMINISTRATION</p>
        <h1>{editingId !== null ? "Edit book" : "Manage books"}</h1>
        <p>
          Keep your reading collection organized and up to date.
        </p>
      </section>

      {message && (
        <p className="admin-message success-message" role="status">
          {message}
        </p>
      )}

      {error && (
        <p className="admin-message error-message" role="alert">
          {error}
        </p>
      )}

      <section className="admin-book-form-section">
        <h2>{editingId !== null ? "Update book details" : "Add a new book"}</h2>

        <form className="admin-book-form" onSubmit={handleSubmit}>
          <label>
            Book title *
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={200}
            />
          </label>

          <label>
            Author *
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              required
              maxLength={150}
            />
          </label>

          <label>
            ISBN
            <input
              name="isbn"
              value={form.isbn}
              onChange={handleChange}
            />
          </label>

          <label>
            Category *
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Publication year
            <input
              type="number"
              name="publication_year"
              value={form.publication_year}
              onChange={handleChange}
              min="1"
              max="9999"
            />
          </label>

          <label>
            Cover image URL
            <input
              type="url"
              name="cover_image_url"
              value={form.cover_image_url}
              onChange={handleChange}
              placeholder="https://example.com/cover.jpg"
            />
          </label>

          <label className="admin-book-description">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </label>

          <div className="admin-form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Save changes"
                  : "Add book"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel editing
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-books-list-section">
        <div className="admin-books-list-header">
          <h2>Book collection</h2>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, author, or ISBN"
            aria-label="Search books"
          />
        </div>

        {loading ? (
          <p>Loading books...</p>
        ) : filteredBooks.length === 0 ? (
          <p>No books found.</p>
        ) : (
          <div className="admin-books-table-wrapper">
            <table className="admin-books-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.publication_year || "—"}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          onClick={() => startEditing(book)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(book)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminBooks;

