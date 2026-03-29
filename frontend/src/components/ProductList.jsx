import { useState, useEffect, useContext } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import './ProductList.css'
import CartContext from '../context/CartContext'

const FALLBACK_IMAGE = 'https://via.placeholder.com/360x240?text=Image+Not+Available'

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

const normalizeProduct = (product) => {
  const extraImages = parseImages(product.extra_images)
  const cleanImage = (product.image_url || '').toString().trim() || extraImages[0] || FALLBACK_IMAGE

  return {
    ...product,
    image_url: cleanImage,
    extra_images: extraImages,
    rating: product.rating != null ? Number(product.rating) : getRandomRating(Number(product.id || 0)),
  }
}

function ProductList() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 16
  const [searchParams, setSearchParams] = useSearchParams()
  const { refreshCartCount } = useContext(CartContext)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    setSearchTerm(search)
    setSelectedCategory(category)
    setPage(1)
    setProducts([])
    setTotal(0)
    setLoading(true)
    fetchProducts(1, search, category)
  }, [searchParams])

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async (pageToLoad = 1, search = searchTerm, category = selectedCategory) => {
    try {
      const params = { page: pageToLoad, limit }
      if (search) params.search = search
      if (category && category !== 'All') params.category = category

      const response = await axios.get('http://localhost:5000/api/products', { params })
      const { data, total: totalCount } = response.data
      const normalized = data.map(normalizeProduct)

      setProducts((prev) => (pageToLoad === 1 ? normalized : [...prev, ...normalized]))
      setTotal(totalCount)
      setPage(pageToLoad)
      setLoading(false)
      setLoadingMore(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const addToCart = async (productId) => {
    try {
      await axios.post('http://localhost:5000/api/cart', { productId, quantity: 1 })
      await refreshCartCount()
      alert('Product added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add product to cart')
    }
  }

  if (loading) {
    return <div className="loading">Loading products...</div>
  }

  return (
    <div className="product-list-page">
      <div className="filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search Amazon"
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value
              setSearchTerm(value)

              const next = Object.fromEntries(searchParams.entries())
              if (value.trim()) next.search = value.trim()
              else delete next.search

              setSearchParams(next)
            }}
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => {
              const value = e.target.value
              setSelectedCategory(value)

              const next = Object.fromEntries(searchParams.entries())
              if (value) next.category = value
              else delete next.category

              setSearchParams(next)
            }}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`} className="product-link">
              <img
                src={product.image_url || FALLBACK_IMAGE}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = FALLBACK_IMAGE
                }}
              />

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${Number(product.price).toFixed(2)}</p>
                <p className="product-category">{product.category}</p>

                <div className="product-rating">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(product.rating) ? 'star filled' : 'star'}>
                      ★
                    </span>
                  ))}
                  <span className="rating-text">{product.rating.toFixed(1)}</span>
                </div>
              </div>
            </Link>

            <button
              className="add-to-cart-btn"
              onClick={(e) => {
                e.preventDefault()
                addToCart(product.id)
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {products.length > 0 && products.length < total && (
        <div className="load-more-container">
          <button
            className="load-more-btn"
            onClick={() => {
              setLoadingMore(true)
              fetchProducts(page + 1)
            }}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More Products'}
          </button>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="empty-results">No products found for the selected filters.</div>
      )}
    </div>
  )
}

export default ProductList