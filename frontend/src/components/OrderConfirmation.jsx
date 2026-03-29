import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import './OrderConfirmation.css'

function OrderConfirmation() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`https://amazon-clone-backend-2l84.onrender.com/api/orders/${orderId}`)
      setOrder(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching order:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading order details...</div>
  }

  if (!order) {
    return <div className="error">Order not found</div>
  }

  const subtotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = subtotal > 25 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-header">
        <div className="checkmark">✓</div>
        <h1>Thank you for your order!</h1>
        <p>Your order has been placed successfully.</p>
      </div>

      <div className="order-details">
        <div className="order-info">
          <h2>Order #{order.id}</h2>
          <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </div>

        <div className="shipping-info">
          <h3>Shipping Address</h3>
          <div className="address">
            <p>{order.shipping_address.name}</p>
            <p>{order.shipping_address.address}</p>
            <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
            <p>{order.shipping_address.country}</p>
          </div>
        </div>

        <div className="order-items">
          <h3>Order Items</h3>
          {order.items.map(item => (
            <div key={item.id} className="order-item">
              <img src={item.image_url} alt={item.name} className="item-image" />
              <div className="item-details">
                <h4>{item.name}</h4>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
              </div>
              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="summary-row">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <Link to="/" className="continue-shopping-btn">
          Continue Shopping
        </Link>
        <Link to="/cart" className="view-cart-btn">
          View Cart
        </Link>
      </div>
    </div>
  )
}

export default OrderConfirmation