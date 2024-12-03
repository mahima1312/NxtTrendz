
import {Link} from 'react-router-dom'
import CartContext from '../../context/CartContext'
import './index.css'

const YourOrders = () => (
  <CartContext.Consumer>
    {value => {
      const {ordersList, removeOrder} = value
      return (
        <div className="your-orders-container">
          <h1 className="your-orders-heading">Your Orders</h1>
          {ordersList.length > 0 ? (
            <ul className="orders-list">
              {ordersList.map(order => {
                // Calculate the total price for the order
                const totalPrice = order.items.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0,
                )
                return (
                  <li key={order.id} className="order-card">
                    <div className="order-header">
                      <p>
                        <strong>Order ID:</strong> {order.id}
                      </p>
                      <p>
                        <strong>Placed On:</strong> {order.date}
                      </p>
                      <p>
                        <strong>Delivery By:</strong> {order.deliveryDate}
                      </p>
                    </div>
                    <div className="order-details">
                      <p>
                        <strong>Payment Method:</strong> {order.paymentMethod}
                      </p>
                      <ul className="order-items">
                        {order.items.map(item => (
                          <li key={item.id} className="order-item">
                            <div className="order-item-info">
                              <p className="item-name">{item.title}</p>
                              <p className="your-orders-quantity">
                                Qty:
                                <span className="item-quantity">
                                  {item.quantity}
                                </span>
                              </p>
                              <p className="your-orders-price">
                                Price:
                                <span className="item-price">
                                  ₹{item.price * item.quantity}
                                </span>
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="total-price-container">
                        <p>
                          <strong>Total Price: </strong>₹{totalPrice}
                        </p>
                      </div>
                      <div className="btn-container">
                        <button
                          type="button"
                          className="cancel-order-button"
                          onClick={() => removeOrder(order.id)} // Remove order from context and localStorage
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="no-orders-message">
              No orders placed yet. Explore products and place your first order!
            </p>
          )}
          <Link to="/products" className="browse-products-link">
            Browse Products
          </Link>
        </div>
      )
    }}
  </CartContext.Consumer>
)
export default YourOrders
