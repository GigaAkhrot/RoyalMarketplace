
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// Local backend for development.
// Once deployed, replace this with your hosted backend URL.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [merchant, setMerchant] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const [products, setProducts] = useState([]);

  // LOAD products from MongoDB
  useEffect(() => {
    axios.get(`${API_URL}/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // SAVE a new product
  async function addProduct(e) {
    e.preventDefault();

    const newProduct = {
      merchant: merchant,
      name: name,
      price: Number(price),
      image: image,
    };

    try {
      const response = await axios.post(
        `${API_URL}/products`,
        newProduct
      );

      setProducts((previousProducts) => [
        ...previousProducts,
        response.data,
      ]);

      setMerchant("");
      setName("");
      setPrice("");
      setImage("");

      alert("Your product has been added!");

    } catch (error) {
      console.log(error);
      alert("Something went wrong. Product could not be saved.");
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h2>⚔ Royal Exchange</h2>

        <div>
          <a href="#home">Home</a>
          <a href="#form">Sell Products</a>
          <a href="#market">Marketplace</a>
        </div>
      </nav>

      <section className="hero" id="home">
        <p className="subtitle">THE KINGDOM'S MARKETPLACE</p>

        <h1>Welcome, Traveller.</h1>

        <p>Have something to sell? Present your finest wares to the kingdom.</p>

        <a href="#form" className="hero-btn">
          Become a Merchant
        </a>
      </section>

      <section className="form-section" id="form">
        <h2>Register Thy Wares</h2>

        <p>Fill in the details of the goods you wish to sell.</p>

        <form onSubmit={addProduct}>
          <label>Merchant Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            required
          />

          <label>Product Name</label>
          <input
            type="text"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Price (Gold Coins)</label>
          <input
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="1"
            required
          />

          <label>Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];

              if (file) {
                const reader = new FileReader();

                reader.onloadend = () => {
                  setImage(reader.result);
                };

                reader.readAsDataURL(file);
              }
            }}
            required
          />

          <button type="submit">Submit Thy Offering</button>
        </form>
      </section>

      <section className="market-section" id="market">
        <h2>The Marketplace</h2>

        <p>Discover the goods offered by our merchants.</p>

        <div className="product-container">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <img src={product.image} alt={product.name} />

              <h3>{product.name}</h3>

              <p>Merchant: {product.merchant}</p>

              <h4>{product.price} Gold Coins</h4>

              <small>ID: {product._id}</small>
            </div>
          ))}

          {products.length === 0 && (
            <p className="empty">No products yet. Be the first merchant!</p>
          )}
        </div>
      </section>

      <footer>© 2026 Royal Exchange | Trade with Honour.</footer>
    </div>
  );
}

export default App;
