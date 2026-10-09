
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ReadingList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function updateStatus(itemId, status) {
    try {
        const token = localStorage.getItem("token");

        await api.put(
            `/reading-list/${itemId}`,
            { status },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === itemId
                    ? { ...item, status }
                    : item
            )
        );
    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Failed to update reading status."
        );
    }
}

async function removeBook(itemId) {
    try {
        const token = localStorage.getItem("token");

        await api.delete(`/reading-list/${itemId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setItems((currentItems) =>
            currentItems.filter((item) => item.id !== itemId)
        );
    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Failed to remove book."
        );
    }
}

    useEffect(() => {
        async function fetchReadingList() {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get("/reading-list", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setItems(
                    response.data.items ??
                    response.data.readingList ??
                    response.data.reading_list ??
                    []
                );
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load your reading list."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchReadingList();
    }, []);

    if (loading) return <p>Loading your reading list...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>My Reading List</h1>
            <Link to="/books">← Explore books</Link>

            {items.length === 0 ? (
                <p>Your reading list is empty. Discover a book to get started!</p>
            ) : (
                items.map((item) => (
                    <div key={item.id}>
                        <h3>{item.title}</h3>
                        <p>Author: {item.author}</p>
                        <p>
                            Status: {(item.status || "")
                                .replaceAll("_", " ")}
                        </p>

                        <label>
                            Update status:{" "}
                            <select
                            value={item.status}
                            onChange={(event) =>
                                updateStatus(item.id, event.target.value)
                            }
                            >
                                <option value="WANT_TO_READ">Want to Read</option>
                                <option value="CURRENTLY_READING">Currently Reading</option>
                                <option value="READ">Read</option>
                                </select>
                                </label>
                                <button onClick={() => removeBook(item.id)}>
                                    Remove
                                    </button>
                                    </div>
                                    ))
                                    )}
                                    </div>
                                    );
                                }

export default ReadingList;