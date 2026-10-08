import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import ReadingList from "./pages/ReadingList";
import AdminBooks from "./pages/AdminBooks";
import AdminCategories from "./pages/AdminCategories";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/books" element={<Books />} />
                <Route path="/reading-list" element={<ReadingList />} />
                <Route path="/admin/books" element={<AdminBooks />} />
                <Route
                    path="/admin/categories"
                    element={<AdminCategories />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;