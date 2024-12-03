import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'
import Checkout from './components/Checkout'
import YourOrders from './components/YourOrders'
import './App.css'

class App extends Component {
  state = {
    cartList: JSON.parse(localStorage.getItem('cartList')) || [],
    ordersList: JSON.parse(localStorage.getItem('ordersList')) || [],
  }

  componentDidUpdate(prevProps, prevState) {
    const {cartList} = this.state
    if (prevState.cartList !== cartList) {
      localStorage.setItem('cartList', JSON.stringify(cartList))
    }
  }

  addOrder = paymentMethod => {
    const {cartList} = this.state
    console.log(cartList)
    if (cartList.length > 0) {
      const newOrder = {
        id: Date.now(),
        items: [...cartList],
        date: new Date().toLocaleDateString(),
        deliveryDate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toLocaleDateString(),
        paymentMethod,
      }
      this.setState(prevState => {
        const updatedOrdersList = [...prevState.ordersList, newOrder]
        localStorage.setItem('ordersList', JSON.stringify(updatedOrdersList))
        return {ordersList: updatedOrdersList}
      })
      this.removeAllCartItems()
    }
  }

  removeCartItem = id => {
    const {cartList} = this.state
    const filterCartItems = cartList.filter(eachItem => eachItem.id !== id)
    this.setState({cartList: filterCartItems}, () => {
      localStorage.setItem('cartList', JSON.stringify(filterCartItems)) // Update cart in localStorage
    })
  }

  incrementCartItemQuantity = id => {
    this.setState(prevState => ({
      cartList: prevState.cartList.map(eachCartItem => {
        if (eachCartItem.id === id) {
          const updatedQuantity = eachCartItem.quantity + 1
          return {...eachCartItem, quantity: updatedQuantity}
        }
        return eachCartItem
      }),
    }))
  }

  decrementCartItemQuantity = id => {
    this.setState(prevState => {
      const updatedCartList = prevState.cartList
        .map(eachCartItem => {
          if (eachCartItem.id === id && eachCartItem.quantity > 1) {
            return {...eachCartItem, quantity: eachCartItem.quantity - 1}
          }
          return eachCartItem
        })
        .filter(item => item.quantity > 0) // Remove items with quantity 0

      // Update localStorage with the new cartList
      localStorage.setItem('cartList', JSON.stringify(updatedCartList))
      return {cartList: updatedCartList}
    })
  }

  removeAllCartItems = () => {
    this.setState({cartList: []}, () => {
      localStorage.setItem('cartList', JSON.stringify([])) // Clear cart in localStorage
    })
  }

  removeOrder = orderId => {
    const {ordersList} = this.state
    const updatedOrdersList = ordersList.filter(order => order.id !== orderId)
    this.setState({ordersList: updatedOrdersList}, () => {
      localStorage.setItem('ordersList', JSON.stringify(updatedOrdersList)) // Update orders in localStorage
    })
  }

  addCartItem = product => {
    this.setState(prevState => {
      const existingProduct = prevState.cartList.find(
        eachCartItem => eachCartItem.id === product.id,
      )
      let updatedCartList

      if (existingProduct) {
        updatedCartList = prevState.cartList.map(eachCartItem => {
          if (eachCartItem.id === product.id) {
            return {
              ...eachCartItem,
              quantity: eachCartItem.quantity + product.quantity,
            }
          }
          return eachCartItem
        })
      } else {
        updatedCartList = [...prevState.cartList, product]
      }

      // Update localStorage here immediately after computing the new cartList
      localStorage.setItem('cartList', JSON.stringify(updatedCartList))
      return {cartList: updatedCartList}
    })
  }

  render() {
    const {cartList, ordersList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          ordersList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
          addOrder: this.addOrder,
          removeOrder: this.removeOrder,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <ProtectedRoute exact path="/checkout" component={Checkout} />
          <ProtectedRoute exact path="/your-orders" component={YourOrders} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
