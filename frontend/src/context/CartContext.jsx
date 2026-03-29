import { createContext } from 'react'

const CartContext = createContext({
  cartCount: 0,
  refreshCartCount: () => {},
})

export default CartContext
