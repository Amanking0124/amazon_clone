import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import Header from './components/Header'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import OrderConfirmation from './components/OrderConfirmation'
import CartContext from './context/CartContext'
import './App.css'

function App() {
  const [cartCount, setCartCount] = useState(0)

  const refreshCartCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart')
      setCartCount(response.data.reduce((total, item) => total + item.quantity, 0))
    } catch (error) {
      console.error('Error refreshing cart count:', error)
    }
  }

  useEffect(() => {
    refreshCartCount()
  }, [])

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          </Routes>
        </main>
      </div>
    </CartContext.Provider>
  )
}

export default App
