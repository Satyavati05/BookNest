import { useEffect, useState } from "react";
import api from "../services/api";

function Books() {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchBooks() {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (search.trim()) {
                params.search = search;
            }

            if (categoryId) {
                params.category_id = categoryId;
            }

            const response = await api.get("/books", { params });

            setBooks(response.data.books);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load books."
            );
        } finally {
            setLoading(false);
        }
    }

    async function fetchCategories() {
        try {
            const response = await api.get("/categories");

            setCategories(response.data.categories);
        } catch (error) {
            console.error("Failed to load categories:", error);
        }
    }

    useEffect(() => {
        fetchCategories();
        fetchBooks();
    }, []);

    function handleSearch(event) {
        event.preventDefault();
        fetchBooks();
    }

    function handleCategoryChange(event) {
        setCategoryId(event.target.value);
    }

    useEffect(() => {
        fetchBooks();
    }, [categoryId]);

    return (
        <div>
            <h1>BookNest</h1>
            <h2>Explore Books</h2>

            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />

                <button type="submit">
                    Search
                </button>
            </form>

            <select
                value={categoryId}
                onChange={handleCategoryChange}
            >
                <option value="">All Categories</option>

                {categories.map((category) => (
                    <option
                        key={category.id}
                        value={category.id}
                    >
                        {category.name}
                    </option>
                ))}
            </select>

            {loading && <p>Loading books...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && books.length === 0 && (
                <p>No books found.</p>
            )}

            {!loading &&
                books.map((book) => (
                    <div key={book.id} className="book-card">
                        {book.cover_image_url && (
                            <img
                            src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
                            alt={book.title}
                            />
                            )}
                            <div>
                                <h3>{book.title}</h3>
                                <p>Author: {book.author}</p>
                                <p>Published: {book.publication_year}</p>
                                <p>{book.description}</p>
                                </div>
                                </div>
                ))}
        </div>
    );
}

export default Books;