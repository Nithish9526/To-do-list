import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = "http://localhost:8000";

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(`${apiUrl}/todos`)
            .then((res) => res.json())
            .then((res) => setTodos(res));
    };

    const handleSubmit = () => {
        setError("");
        if (title.trim() && description.trim()) {
            fetch(`${apiUrl}/todos`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, { title, description }]);
                    setTitle("");
                    setDescription("");
                    setMessage("Item added successfully");
                    setTimeout(() => setMessage(""), 3000);
                } else {
                    setError("Unable to create Todo item");
                }
            }).catch(() => setError("Unable to create Todo item"));
        }
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = () => {
        setError("");
        if (editTitle.trim() && editDescription.trim()) {
            fetch(`${apiUrl}/todos/${editId}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    setTodos(todos.map(item => item._id === editId ? { ...item, title: editTitle, description: editDescription } : item));
                    setEditTitle("");
                    setEditDescription("");
                    setMessage("Item updated successfully");
                    setTimeout(() => setMessage(""), 3000);
                    setEditId(-1);
                } else {
                    setError("Unable to update Todo item");
                }
            }).catch(() => setError("Unable to update Todo item"));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            fetch(`${apiUrl}/todos/${id}`, { method: "DELETE" })
                .then(() => setTodos(todos.filter(item => item._id !== id)));
        }
    };

    return (
        <>
            <div className="row p-3 bg-success text-light">
                <h1>ToDo Project with MERN Stack</h1>
            </div>
            <div className="row">
                <h3>Add Item</h3>
                {message && <p className="text-success">{message}</p>}
                <div className="form-group d-flex gap-2">
                    <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" />
                    <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" />
                    <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
                </div>
                {error && <p className="text-danger">{error}</p>}
            </div>
            <div className="row mt-3">
                <h3>Tasks</h3>
                <div className="col-md-6">
                    <ul className="list-group">
                        {todos.map(item => (
                            <li key={item._id} className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                                <div className="d-flex flex-column me-2">
                                    {editId === item._id ? (
                                        <div className="form-group d-flex gap-2">
                                            <input placeholder="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="form-control" />
                                            <input placeholder="Description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="form-control" />
                                        </div>
                                    ) : (
                                        <>
                                            <span className="fw-bold">{item.title}</span>
                                            <span>{item.description}</span>
                                        </>
                                    )}
                                </div>
                                <div className="d-flex gap-2">
                                    {editId === item._id ? (
                                        <>
                                            <button className="btn btn-warning" onClick={handleUpdate}>Update</button>
                                            <button className="btn btn-danger" onClick={() => setEditId(-1)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
