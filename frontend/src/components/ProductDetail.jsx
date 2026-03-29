import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import CartContext from '../context/CartContext'
import './ProductDetail.css'

const FALLBACK_IMAGE = 'https://via.placeholder.com/520x400?text=No+Image'

const getRandomRating = (id) => {
  const base = ((id * 17) % 20) / 10 + 3.2
  const clamped = Math.max(2.5, Math.min(5, base))
  return Number(clamped.toFixed(1))
}

const parseImages = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string') {
    return value.split(',').map((img) => img.trim()).filter(Boolean)
  }
  return []
}

function ProductDetail() {
  const { refreshCartCount } = useContext(CartContext)
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`)
      const item = response.data
      const extraImages = parseImages(item.extra_images)

      const normalizedProduct = {
        ...item,
        image_url: (item.image_url || '').toString().trim() || extraImages[0] || FALLBACK_IMAGE,
        extra_images: extraImages,
        rating: item.rating != null ? Number(item.rating) : getRandomRating(Number(item.id || 0)),
      }

      setProduct(normalizedProduct)
      setCurrentImageIndex(0)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching product:', error)
      setLoading(false)
    }
  }

  const addToCart = async () => {
    try {
      await axios.post('http://localhost:5000/api/cart', { productId: product.id, quantity: 1 })
      await refreshCartCount()
      alert('Product added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add product to cart')
    }
  }

  const buyNow = async () => {
    try {
      await axios.post('http://localhost:5000/api/cart', { productId: product.id, quantity: 1 })
      await refreshCartCount()
      window.location.href = '/checkout'
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to continue to checkout')
    }
  }

  if (loading) {
    return <div className="loading">Loading product...</div>
  }

  if (!product) {
    return <div className="error">Product not found</div>
  }

  const images = [product.image_url, ...product.extra_images].filter(Boolean)

  return (
    <div className="product-detail-page">
      <div className="product-detail">
        <div className="product-images">
          <div className="main-image">
            <img
              src={images[currentImageIndex] || FALLBACK_IMAGE}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = FALLBACK_IMAGE
              }}
            />
          </div>

          <div className="thumbnail-images">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} ${index + 1}`}
                className={currentImageIndex === index ? 'active' : ''}
                onClick={() => setCurrentImageIndex(index)}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = FALLBACK_IMAGE
                }}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-category">{product.category}</p>

          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < Math.round(product.rating) ? 'star filled' : 'star'}
              >
                ★
              </span>
            ))}
            <span className="rating-text">{product.rating.toFixed(1)}</span>
          </div>

          <div className="product-price">${Number(product.price).toFixed(2)}</div>

          <div className="stock-status">
            {product.stock > 0 ? (
              <span className="in-stock">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>

          <div className="action-buttons">
            <button
              className="add-to-cart-btn"
              onClick={addToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>

            <button
              className="buy-now-btn"
              onClick={buyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>
        </div>

        <div className="product-description">
          <h2>About this item</h2>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail