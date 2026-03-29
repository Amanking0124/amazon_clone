import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import CartContext from '../context/CartContext'
import './Header.css'

function Header() {
  const { cartCount } = useContext(CartContext)
  const [searchInput, setSearchInput] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearchInput(params.get('search') || '')
  }, [location.search])

  const handleSearch = () => {
    const query = searchInput.trim()
    if (query) {
      navigate(`/?search=${encodeURIComponent(query)}`)
    } else {
      navigate('/')
    }
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-text">amazon</span>
          <span className="logo-dot">.</span>
          <span className="logo-com">com</span>
        </Link>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Amazon"
            className="search-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button className="search-button" title="Search" onClick={handleSearch}>
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </div>

        <div className="header-recs">
          <span>Deals of the Day</span>
          <span>Free Delivery</span>
          <span>Amazon Pay</span>
        </div>

        <nav className="nav-links">
          <Link to="/cart" className="cart-link">
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{cartCount}</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header