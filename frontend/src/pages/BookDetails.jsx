import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function BookDetails() {
    const { id } = useParams();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        async function fetchBook() {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/books/${id}`);
                setBook(response.data.book);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load book details."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchBook();
    }, [id]);

    async function handleAddToReadingList() {
    setMessage("");
    setAdding(true);

    try {
        const token = localStorage.getItem("token");

        await api.post(
            "/reading-list",
            {
                book_id: Number(id),
                status: "WANT_TO_READ",
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setMessage("Book added to your reading list!");
    } catch (error) {
        setMessage(
            error.response?.data?.message ||
            "Could not add book. Please log in and try again."
        );
    } finally {
        setAdding(false);
    }
}

    if (loading) {
        return <p>Loading book details...</p>;
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <Link to="/books">Back to books</Link>
            </div>
        );
    }

    if (!book) {
        return <p>Book not found.</p>;
    }

    return (
        <div>
            <Link to="/books">← Back to books</Link>

            <h1>{book.title}</h1>

            <img
                src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
                alt={book.title}
                style={{ width: "180px" }}
            />

            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Published:</strong> {book.publication_year}</p>
            <p><strong>ISBN:</strong> {book.isbn}</p>
            <p>{book.description}</p>

            <button
            onClick={handleAddToReadingList}
            disabled={adding}
            >
                {adding ? "Adding..." : "Add to Reading List"}
                </button>
                {message && <p>{message}</p>}
        </div>
    );
}

export default BookDetails;