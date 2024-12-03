import {Component} from "react"
import {withRouter} from 'react-router-dom'
import CartContext from '../../context/CartContext'

import './index.css'

class Checkout extends Component {
  state = {
    selectedPaymentMethod: '',
    isOrderPlaced: false,
  }

  handlePaymentSelect = method => {
    this.setState({selectedPaymentMethod: method})
  }

  placeOrder = value => {
    const {selectedPaymentMethod} = this.state
    if (selectedPaymentMethod) {
      value.addOrder(selectedPaymentMethod)
      this.setState({isOrderPlaced: true})
    } else {
      alert('Please select a payment method to proceed.')
    }
  }

  navigateToOrders = () => {
    const {history} = this.props
    history.replace('/your-orders') // Navigate to the 'Your Orders' page
  }

  render() {
    const {selectedPaymentMethod, isOrderPlaced} = this.state
    return (
      <CartContext.Consumer>
        {value => {
          const {cartList} = value
          const totalAmount = cartList.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
          )
          return (
            <div className="checkout-container">
              {!isOrderPlaced ? (
                <>
                  <h1 className="checkout-heading">Checkout</h1>
                  <p className="checkout-total">
                    Total Amount:{' '}
                    <span className="total-amount"> Rs {totalAmount} </span>
                  </p>
                  <h2>Select Payment Method</h2>
                  <ul className="payment-methods-list">
                    {['Google Pay', 'PhonePe', 'Cash on Delivery'].map(
                      method => (
                        <li key={method}>
                          <button
                            type="button"
                            className={`payment-method-button ${
                              selectedPaymentMethod === method
                                ? 'selected-payment-method'
                                : ''
                            }`}
                            onClick={() => this.handlePaymentSelect(method)}
                          >
                            {method}
                          </button>
                        </li>
                      ),
                    )}
                  </ul>
                  <button
                    type="button"
                    className="place-order-button"
                    onClick={() => this.placeOrder(value)}
                  >
                    Place Order
                  </button>
                </>
              ) : (
                <div className="order-success-container">
                  <h1 className="success-heading">
                    Order Placed Successfully!
                  </h1>
                  <p>
                    You chose <strong>{selectedPaymentMethod}</strong> as your
                    payment method.
                  </p>
                  <p>Thank you for shopping with us!</p>
                  <button
                    type="button"
                    className="view-orders-button"
                    onClick={this.navigateToOrders} // Trigger navigation
                  >
                    View Your Orders
                  </button>
                </div>
              )}
            </div>
          )
        }}
      </CartContext.Consumer>
    )
  }
}
export default withRouter(Checkout)
