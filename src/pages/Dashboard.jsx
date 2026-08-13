import { useEffect, useState } from "react";
import client from "../api/client";

const PAGE_SIZE = 6;

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function fetchProducts() {
    setLoading(true);
    setError("");
    try {
      const res = await client.get("/api/products/search", {
        params: { keyword: keyword || undefined, category: category || undefined, page, size: PAGE_SIZE },
      });
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      setError("Could not load products. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(0);
    fetchProducts();
  }

  return (
    <div className="page-container">
      <h1>Products</h1>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Search by name..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          placeholder="Filter by category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="muted">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="muted">No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <h3>{p.name}</h3>
              <span className="badge">{p.category}</span>
              <p className="price">₹{p.price?.toLocaleString()}</p>
              <p className="muted">Stock: {p.stockQuantity}</p>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-ghost"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className="muted">Page {page + 1} of {totalPages}</span>
          <button
            className="btn btn-ghost"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
