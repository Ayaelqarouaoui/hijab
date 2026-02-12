import { useState, useEffect } from 'react';
import './App.css';
import { useCart } from './hooks/useCart';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({ id: 1, img: '', title: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<number[]>([]);
  const [personalMessage, setPersonalMessage] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const { cartItems, products, loading, addToCart, removeFromCart, updateQuantity, cartCount, fetchCart } = useCart();

  const productNumbers = Array.from({ length: 18 }, (_, i) => i + 1);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(productNumbers);
    } else {
      const filtered = productNumbers.filter(num =>
        `MODÈLE EXCELLENCE N°${num}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        num.toString().includes(searchQuery)
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const openModal = (id: number) => {
    setSelectedProduct({
      id,
      img: `images/hijab${id}.jpeg`,
      title: `MODÈLE EXCELLENCE N°${id} - CHALHER PARIS`
    });
    setPersonalMessage('');
    setAddedSuccess(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPersonalMessage('');
  };

  const selectProduct = (id: number) => {
    setSelectedProduct({
      id,
      img: `images/hijab${id}.jpeg`,
      title: `MODÈLE EXCELLENCE N°${id} - CHALHER PARIS`
    });
  };

  const handleAddToCart = async () => {
    const product = products.find(p => p.model_number === selectedProduct.id);
    if (product) {
      await addToCart(product.id, personalMessage);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
      setPersonalMessage('');
      await fetchCart();
    }
  };

  const getTotalPrice = () => {
    return (cartItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.product_id);
      return sum + ((product?.price || 54.95) * item.quantity);
    }, 0)).toFixed(2);
  };

  return (
    <>
      <header>
        <div className="header-container">
          <div className="menu-burger"><i className="fas fa-bars"></i></div>
          <div className="logo">CHALHER <span>PARIS</span></div>
          <div className="header-icons">
            <div className="search-container">
              <i className="fas fa-search"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Rechercher un modèle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <i className="fas fa-user"></i>
            <div className="shopping-bag-wrapper" onClick={() => setShowCart(!showCart)}>
              <i className="fas fa-shopping-bag"></i>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
          </div>
        </div>
      </header>

      {showCart && (
        <div className="cart-dropdown">
          <div className="cart-header">
            <h3>PANIER ({cartCount} article{cartCount !== 1 ? 's' : ''})</h3>
            <i className="fas fa-times" onClick={() => setShowCart(false)}></i>
          </div>
          <div className="cart-items-list">
            {cartItems.length === 0 ? (
              <p className="empty-cart">Votre panier est vide</p>
            ) : (
              cartItems.map(item => {
                const product = products.find(p => p.id === item.product_id);
                return (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <p className="cart-item-name">{product?.title}</p>
                      {item.message && <p className="cart-item-message">Message: {item.message}</p>}
                      <p className="cart-item-price">{(product?.price || 54.95).toFixed(2)} €</p>
                    </div>
                    <div className="cart-item-qty">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                );
              })
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <p>Total: <strong>{getTotalPrice()} €</strong></p>
              </div>
              <button className="checkout-btn">COMMANDER</button>
            </div>
          )}
        </div>
      )}

      <section className="hero">
        <div className="hero-content">
          <h1>CHALHER PARIS</h1>
          <p>COLLECTION RAMADAN-AÏD 2026</p>
          <a href="#collection" className="btn-discover">VOIR LA COLLECTION</a>
        </div>
      </section>

      <section className="reassurance">
        <div className="re-item"><i className="fas fa-truck"></i> LIVRAISON OFFERTE</div>
        <div className="re-item"><i className="fas fa-sync"></i> SATISFAIT OU REMBOURSÉ</div>
        <div className="re-item"><i className="fas fa-lock"></i> PAIEMENT SÉCURISÉ</div>
      </section>

      <section id="collection" className="gallery-section">
        <div className="grid-container" id="gallery">
          {filteredProducts.map((i) => (
            <div key={i} className="product-card" onClick={() => openModal(i)}>
              <img src={`images/hijab${i}.jpeg`} alt={`CHALHER N°${i}`} loading="lazy" />
              <p style={{ marginTop: '10px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>
                MODÈLE EXCELLENCE N°{i}
              </p>
            </div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '14px', color: '#999' }}>
            Aucun produit trouvé
          </div>
        )}
      </section>

      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={closeModal}>&times;</span>
            <div className="product-page-flex">
              <div className="product-view">
                <img id="modalImage" src={selectedProduct.img} alt={selectedProduct.title} />
                <div className="product-thumbnails">
                  {productNumbers.map((id) => (
                    <div
                      key={id}
                      className={`thumbnail ${selectedProduct.id === id ? 'active' : ''}`}
                      onClick={() => selectProduct(id)}
                    >
                      <img src={`images/hijab${id}.jpeg`} alt={`Modèle ${id}`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="product-info">
                <nav className="breadcrumb">CHALHER SHOP / NOUVEAUTÉS</nav>
                <h2 id="modalTitle">{selectedProduct.title}</h2>
                <div className="stock-tag">! Derniers articles en stock</div>
                <p className="product-price">54,95 € <span className="ttc">TTC</span></p>

                <div className="personalisation-box">
                  <h4>Personnalisation</h4>
                  <p>N'oubliez pas de sauvegarder votre personnalisation pour pouvoir l'ajouter au panier</p>
                  <label>Indiquez le message à y inscrire :</label>
                  <textarea
                    placeholder="Votre message ici..."
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                  ></textarea>
                  <span className="optional">optionnel</span>
                </div>

                <button
                  className={`add-to-cart ${addedSuccess ? 'success' : ''}`}
                  onClick={handleAddToCart}
                  disabled={loading}
                >
                  {addedSuccess ? '✓ AJOUTÉ AU PANIER' : 'AJOUTER AU PANIER'}
                </button>

                <div className="social-links">
                  <a href="https://wa.me/33123456789" target="_blank" rel="noopener noreferrer" className="social-btn whatsapp">
                    <i className="fab fa-whatsapp"></i> Contacter sur WhatsApp
                  </a>
                  <a href="https://instagram.com/chalherparis" target="_blank" rel="noopener noreferrer" className="social-btn instagram">
                    <i className="fab fa-instagram"></i> Suivez-nous sur Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer>
        <div className="footer-links">
          <div className="f-col">
            <h4>INFORMATIONS</h4>
            <p>Contactez-nous</p>
            <p>Livraison</p>
          </div>
          <div className="f-col">
            <h4>NOS LIENS</h4>
            <p>Blog</p>
            <p>Ramadan 2026</p>
          </div>
          <div className="f-col">
            <h4>MON COMPTE</h4>
            <p>Mes commandes</p>
          </div>
        </div>
        <div className="footer-social">
          <a href="https://wa.me/33123456789" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-whatsapp"></i>
          </a>
          <a href="https://instagram.com/chalherparis" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <div className="footer-bottom">
          <p>© 2026 CHALHER Paris. Luxe et Élégance.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
