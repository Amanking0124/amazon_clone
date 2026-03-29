import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import CartContext from '../context/CartContext'
import './Cart.css'

const FALLBACK_IMAGE = 'https://via.placeholder.com/150?text=No+Image'

function Cart() {
  const { refreshCartCount } = useContext(CartContext)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await axios.get('https://amazon-clone-backend-2l84.onrender.com/api/cart')
      setCartItems(response.data)
      setLoading(false)
      await refreshCartCount()
    } catch (error) {
      console.error('Error fetching cart:', error)
      setLoading(false)
    }
  }

  const updateQuantity = async (cartId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await axios.delete(`https://amazon-clone-backend-2l84.onrender.com/api/cart/${cartId}`)
      } else {
        await axios.put(`https://amazon-clone-backend-2l84.onrender.com/api/cart/${cartId}`, { quantity: newQuantity })
      }
      await fetchCart()
    } catch (error) {
      console.error('Error updating cart:', error)
      alert('Failed to update cart')
    }
  }

  const removeItem = async (cartId) => {
    try {
      await axios.delete(`https://amazon-clone-backend-2l84.onrender.com/api/cart/${cartId}`)
      await fetchCart()
    } catch (error) {
      console.error('Error removing item:', error)
      alert('Failed to remove item')
    }
  }

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = subtotal > 25 ? 0 : 5.99
  const total = subtotal + shipping

  if (loading) {
    return <div className="loading">Loading cart...</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Amazon Cart is empty</h2>
        <p>Shop today&apos;s deals</p>
        <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <span className="cart-count">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.cart_id} className="cart-item">
              <Link to={`/product/${item.id}`} className="item-image">
                <img
                  src={(item.image_url || '').trim() || FALLBACK_IMAGE}
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = FALLBACK_IMAGE
                  }}
                />
              </Link>

              <div className="item-details">
                <Link to={`/product/${item.id}`} className="item-name">
                  {item.name}
                </Link>
                <p className="item-price">${Number(item.price).toFixed(2)}</p>
                <p className="item-category">{item.category}</p>

                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}
                  >
                    -
                  </button>

                  <span className="quantity">{item.quantity}</span>

                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.cart_id)}
                >
                  Delete
                </button>
              </div>

              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Cart Summary</h2>

          <div className="summary-row">
            <span>Subtotal ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''}):</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping:</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div className="summary-row total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart