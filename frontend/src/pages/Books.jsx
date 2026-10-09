
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
                params.search = search.trim();
            }

            if (categoryId) {
                params.category_id = categoryId;
            }

            const response = await api.get("/books", { params });
            setBooks(response.data.books ?? []);
        }
        catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load books. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    async function fetchCategories() {
        try {
            const response = await api.get("/categories");
            setCategories(response.data.categories ?? []);
        } catch (error) {
            console.error("Failed to load categories:", error);
        }
    }

    useEffect(() => {
        fetchCategories();

    }, []);

    useEffect(() => {
        fetchBooks();
    }, [categoryId]);

    function handleSearch(event) {
        event.preventDefault();
        fetchBooks();
    }


    return (
        <div className="books-page">
            <section className="books-hero">
                <p className="eyebrow">A READING SPACE BY SATYAVATI DEVI</p>

                <h1>Find your next great read.</h1>

                <p className="hero-description">
                    Explore stories, discover new ideas, and build a reading
                    list that inspires you.
                </p>

                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="search"
                        placeholder="Search by book title or author..."
                        aria-label="Search books by title or author"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                    <button type="submit" disabled={loading}>
                        Search
                    </button>
                </form>
            </section>

            <section className="catalog-section">
                <div className="catalog-heading">
                    <div>
                        <p className="eyebrow">THE COLLECTION</p>
                        <h2>Explore Books</h2>
                    </div>

                    <div className="category-filter">
                        <label htmlFor="category-filter">Genre</label>
                        <select
                            id="category-filter"
                            value={categoryId}
                            onChange={(event) =>
                                setCategoryId(event.target.value)
                            }
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
                    </div>
                </div>

                {loading && (
                    <p className="state-message">Finding books for you...</p>
                )}

                {error && (
                    <div className="state-message error-message">
                        {error}
                        <button onClick={fetchBooks}>Try again</button>
                    </div>
                )}

                {!loading && !error && books.length === 0 && (
                    <div className="empty-state">
                        <h3>No books found just yet.</h3>
                        <p>
                            Try another search or choose a different category.
                        </p>
                        <button
                            onClick={() => {
                                setSearch("");
                                setCategoryId("");
                            }}
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {!loading && !error && books.length > 0 && (
                    <div className="book-grid">
                        {books.map((book) => (
                            <article className="book-card" key={book.id}>
                                <Link
                                    to={`/books/${book.id}`}
                                    className="book-cover-link"
                                    aria-label={`View ${book.title}`}
                                >
                                    {book.isbn ? (
                                        <img
                                            className="book-cover"
                                            src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
                                            alt={`Cover of ${book.title}`}
                                            loading="lazy"
                                            onError={(event) => {
                                                event.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />
                                    ) : (
                                        <div className="cover-placeholder">
                                            <span>BOOKNEST</span>
                                            <strong>{book.title}</strong>
                                        </div>
                                    )}
                                </Link>

                                <div className="book-info">
                                    <h3>
                                        <Link to={`/books/${book.id}`}>
                                            {book.title}
                                        </Link>
                                    </h3>

                                    <p className="book-author">
                                        by {book.author}
                                    </p>

                                    {book.publication_year && (
                                        <p className="book-year">
                                            {book.publication_year}
                                        </p>
                                    )}

                                    {book.description && (
                                        <p className="book-description">
                                            {book.description}
                                        </p>
                                    )}

                                    <Link
                                        to={`/books/${book.id}`}
                                        className="details-link"
                                    >
                                        View details →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Books;