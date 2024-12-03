import React from 'react'

const CartContext = React.createContext({
  cartList: [],
  ordersList: [],
  removeAllCartItems: () => {},
  addCartItem: () => {},
  removeCartItem: () => {},
  incrementCartItemQuantity: () => {},
  decrementCartItemQuantity: () => {},
  addOrder: () => {},
  removeOrder: () => {},
})
export default CartContext
