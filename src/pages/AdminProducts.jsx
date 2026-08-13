import { useEffect, useState } from "react";
import client from "../api/client";

const EMPTY_FORM = { name: "", category: "", stockQuantity: "", price: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const res = await client.get("/api/products");
      setProducts(res.data);
    } catch {
      setError("Could not load products");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      stockQuantity: product.stockQuantity,
      price: product.price,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const payload = {
      name: form.name,
      category: form.category,
      stockQuantity: Number(form.stockQuantity),
      price: Number(form.price),
    };
    try {
      if (editingId) {
        await client.put(`/api/products/${editingId}`, payload);
      } else {
        await client.post("/api/products", payload);
      }
      cancelEdit();
      fetchAll();
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object" && !data.message) {
        setError(Object.values(data).join(", "));
      } else {
        setError(data?.message || "Something went wrong");
      }
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await client.delete(`/api/products/${id}`);
      fetchAll();
    } catch {
      setError("Could not delete product");
    }
  }

  return (
    <div className="page-container">
      <h1>Admin — Manage products</h1>

      <form className="product-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit product" : "Add product"}</h2>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-row">
          <div>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Category</label>
            <input name="category" value={form.category} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Stock quantity</label>
            <input name="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={handleChange} required />
          </div>
          <div>
            <label>Price</label>
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingId ? "Update product" : "Add product"}
          </button>
          {editingId && (
            <button type="button" className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>
          )}
        </div>
      </form>

      <h2>All products</h2>
      {loading ? (
        <p className="muted">Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.stockQuantity}</td>
                <td>₹{p.price?.toLocaleString()}</td>
                <td className="table-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
