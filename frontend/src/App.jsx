
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import ReadingList from "./pages/ReadingList";
import AdminBooks from "./pages/AdminBooks";
import AdminCategories from "./pages/AdminCategories";
import BookDetails from "./pages/BookDetails";
import Profile from "./pages/Profile";

function App() {
    const token = localStorage.getItem("token");

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        // Handle invalid or corrupted user data in localStorage.
    }

    const isAdmin = Boolean(token && Number(user?.is_admin) === 1);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    }

    return (
        <BrowserRouter>
            <header className="navbar">
                <Link to="/books" className="brand">
                    BookNest<span>.</span>
                </Link>

                <nav className="nav-links">
                    <Link to="/books">Discover Books</Link>

                    {token && (
                        <>
                            <Link to="/reading-list">My Reading List</Link>
                            <Link to="/profile">My Profile</Link>

                            {isAdmin && (
                                <>
                                    <Link to="/admin/books">Manage Books</Link>
                                    <Link to="/admin/categories">
                                        Manage Categories
                                    </Link>
                                </>
                            )}
                        </>
                    )}

                    {!token && (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register" className="nav-register">
                                Get Started
                            </Link>
                        </>
                    )}

                    {token && (
                        <button type="button" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </nav>
            </header>

            <main className="page-container">
                <Routes>
                    <Route path="/" element={<Navigate to="/books" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/books/:id" element={<BookDetails />} />
                    <Route path="/reading-list" element={<ReadingList />} />
                    <Route path="/profile" element={<Profile />} />

                    <Route
                        path="/admin/books"
                        element={
                            isAdmin ? (
                                <AdminBooks />
                            ) : (
                                <Navigate to="/books" replace />
                            )
                        }
                    />

                    <Route
                        path="/admin/categories"
                        element={
                            isAdmin ? (
                                <AdminCategories />
                            ) : (
                                <Navigate to="/books" replace />
                            )
                        }
                    />
                </Routes>
            </main>

            <footer className="site-footer">
                <div className="footer-brand">
                    BookNest<span>.</span>
                </div>

                <p>
                    A little space for readers, stories, and new beginnings.
                </p>

                <div className="footer-credit">
                    Designed &amp; developed with care by{" "}
                    <strong>Satyavati Devi</strong>
                </div>

                <p className="footer-copyright">
                    © {new Date().getFullYear()} BookNest. Made for the love
                    of reading.
                </p>
            </footer>
        </BrowserRouter>
    );
}

export default App;
