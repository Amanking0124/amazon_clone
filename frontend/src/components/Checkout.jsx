import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Checkout.css'

function Checkout() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  })
  const [placingOrder, setPlacingOrder] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await axios.get('https://amazon-clone-backend-2l84.onrender.com/api/cart')
      setCartItems(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching cart:', error)
      setLoading(false)
    }
  }

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    })
  }

  const placeOrder = async () => {
    // Validate form
    if (!shippingAddress.name || !shippingAddress.address || !shippingAddress.city ||
        !shippingAddress.state || !shippingAddress.zipCode) {
      alert('Please fill in all shipping address fields')
      return
    }

    setPlacingOrder(true)
    try {
      const response = await axios.post('https://amazon-clone-backend-2l84.onrender.com/api/orders', {
        shippingAddress
      })
      navigate(`/order-confirmation/${response.data.orderId}`)
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order. Please try again.')
      setPlacingOrder(false)
    }
  }

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = subtotal > 25 ? 0 : 5.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  if (loading) {
    return <div className="loading">Loading checkout...</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-checkout">
        <h2>Your cart is empty</h2>
        <a href="/" className="continue-shopping-btn">Continue Shopping</a>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-content">
        <div className="checkout-left">
          <div className="shipping-section">
            <h2>Shipping Address</h2>
            <div className="address-form">
              <div className="form-row">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={shippingAddress.name}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-right">
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.cart_id} className="order-item">
                  <img src={item.image_url} alt={item.name} className="item-image" />
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-quantity">Qty: {item.quantity}</p>
                  </div>
                  <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="total-row">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="place-order-btn"
              onClick={placeOrder}
              disabled={placingOrder}
            >
              {placingOrder ? 'Placing Order...' : 'Place Your Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout