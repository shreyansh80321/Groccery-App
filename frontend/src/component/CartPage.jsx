import React from "react";
import { cartStyles } from "../assets/dummyStyles";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useCart } from "../CartContext";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const getItemPrice = (item) => item.price ?? item.product?.price ?? 0;
  const getItemName = (item) =>
    item.name ?? item.product?.name ?? "Unnamed item";
  const getItemImage = (item) => {
    const path = item.image ?? item.product?.imageUrl ?? "";
    return path ? `https://groccery-app-backend.onrender.com${path}` : "";
  };

  const subTotal = cart.reduce((sum, item) => {
    return sum + getItemPrice(item) * item.quantity;
  }, 0);

  const handleQuantityChange = async (productId, delta) => {
    // Find the cart item corresponding to this product
    const cartItem = cart.find((item) => item.productId === productId);

    if (!cartItem) return; // If item is not in cart, do nothing

    const newQty = cartItem.quantity + delta;

    if (newQty > 0) {
      await updateQuantity(cartItem.id, newQty); // Use CartItem ID here
    } else {
      await removeFromCart(cartItem.id); // Also use CartItem ID
    }
  };

  if (cart.length === 0) {
    return (
      <div className={cartStyles.pageContainer}>
        <div className={cartStyles.maxContainer}>
          <Link to="/items" className={cartStyles.continueShopping}>
            <FiArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
          <div className={cartStyles.emptyCartContainer}>
            <div className={cartStyles.emptyCartIcon}>🛒</div>
            <h1 className={cartStyles.emptyCartHeading}>Your Cart is Empty</h1>
            <p className={cartStyles.emptyCartText}>
              Looks like you have not added anything in cart
            </p>
            <Link to="/items" className={cartStyles.emptyCartButton}>
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={cartStyles.pageContainer}>
      <div className={cartStyles.maxContainer}>
        <div className={cartStyles.headerContainer}>
          <h1 className={cartStyles.headerTitle}>Your Shopping Cart</h1>
          <button onClick={clearCart} className={cartStyles.clearCartButton}>
            <FiTrash2 className="mr-1" />
          </button>
        </div>
        <div className={cartStyles.cartGrid}>
          <div className={cartStyles.cartItemsSection}>
            <div className={cartStyles.cartItemsGrid}>
              {cart.map((item) => {
                const id = item._id || item.id;
                const name = getItemName(item);
                const price = getItemPrice(item);
                const img = getItemImage(item);
                return (
                  <div key={id} className={cartStyles.cartItemCard}>
                    <div className={cartStyles.cartItemImageContainer}>
                      {img ? (
                        <img
                          src={img}
                          alt={name}
                          className={cartStyles.cartItemImage}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.source = "/no-image.png";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 rounded">
                          No Image
                        </div>
                      )}
                    </div>
                    <h3 className={cartStyles.cartItemName}>{name}</h3>
                    <p className={cartStyles.cartItemPrice}>
                      ₹{price.toFixed(2)}
                    </p>
                    <div className={cartStyles.cartItemQuantityContainer}>
                      <button
                        onClick={() => handleQuantityChange(item.productId, -1)}
                        className={cartStyles.cartItemQuantity}
                      >
                        <FiMinus />
                      </button>
                      <span className={cartStyles.cartItemQuantity}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, 1)}
                        className={cartStyles.cartItemQuantityButton}
                      >
                        <FiPlus />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(id)}
                      className={cartStyles.cartItemRemoveButton}
                    >
                      <FiTrash2 className="mr-1" />
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className={cartStyles.orderSummaryCard}>
              <h2 className={cartStyles.orderSummaryTitle}></h2>
              <div className="space-y-4 text-sm sm:text-base">
                <div className={cartStyles.orderSummaryRow}>
                  <span className={cartStyles.orderSummaryLabel}>Subtotal</span>
                  <span className={cartStyles.orderSummaryValue}>
                    ₹{subTotal.toFixed(2)}
                  </span>
                </div>
                <div className={cartStyles.orderSummaryRow}>
                  <span className={cartStyles.orderSummaryLabel}>Shipping</span>
                  <span className={cartStyles.orderSummaryValue}>Free</span>
                </div>
                <div className={cartStyles.orderSummaryRow}>
                  <span className={cartStyles.orderSummaryLabel}>
                    Taxes(5%)
                  </span>
                  <span className={cartStyles.orderSummaryValue}>
                    ₹{(subTotal * 0.05).toFixed(2)}
                  </span>
                </div>
                <div className={cartStyles.orderSummaryDivider}></div>
                <div className={cartStyles.orderSummaryTotalRow}>
                  <span className={cartStyles.orderSummaryTotalLabel}>
                    Total
                  </span>
                  <span className={cartStyles.orderSummaryTotalValue}>
                    {" "}
                    ₹{(subTotal * 1.05).toFixed(2)}
                  </span>
                </div>
              </div>
              <button className={cartStyles.checkoutButton}>
                <Link to="/checkout">Proceed to checkout</Link>
              </button>
              <div className={cartStyles.continueShoppingBottom}>
                <Link to="items" className={cartStyles.continueShopping}>
                  <FiArrowLeft className="mr-2" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
