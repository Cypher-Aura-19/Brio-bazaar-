import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../redux/features/cart/cartSlice";
import { loadStripe } from '@stripe/stripe-js';

const OrderSummary = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const products = useSelector((store) => store.cart.products);
  const { tax, taxRate, grandTotal, totalPrice, selectedItems } = useSelector((store) => store.cart);

  const [allProducts, setAllProducts] = useState([]);  // State to store all products
  const [error, setError] = useState(null);  // To capture any fetch errors
  const [stockError, setStockError] = useState(null);  // To handle stock error

  // Fetch all products from the server
  const fetchAllProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      if (data.products && Array.isArray(data.products)) {
        setAllProducts(data.products);  // Set all products if they are in the correct format
      } else {
        setError('Products not in the correct format');
      }
    } catch (error) {
      setError(error.message);  // Handle any error in fetching products
    }
  };

  useEffect(() => {
    fetchAllProducts();  // Call the fetch function when the component mounts
  }, []);

  // Clear cart action
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // Payment integration
  const makePayment = async (e) => {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK);

    // Check stock levels before proceeding to checkout
    const isStockAvailable = checkStockAvailability();
    if (!isStockAvailable) {
      setStockError("Some items exceed the available stock. Please adjust your order.");
      return;  // Prevent the request if stock is insufficient
    }
    setStockError(null);  // Reset stock error if everything is fine

    // Extract product IDs and match them with the fetched products
    const productIds = products.map((product) => product._id);

    const body = {
      products: products,
      productIds: productIds, // Add product IDs to the body
      userId: user?._id,
    };

    updateStockLevels();

    const headers = {
      "Content-Type": "application/json",
    };

    // Create checkout session
    const response = await fetch(`http://localhost:5000/api/orders/create-checkout-session`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    const session = await response.json();

    // Redirect to Stripe checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error.message); // Handle any errors
    } else {
      // If successful, update stock levels
      updateStockLevels();
    }
  };

  const checkStockAvailability = () => {
    let stockIssues = [];  // Array to hold stock errors for products
    let isStockAvailable = true;

    for (const product of products) {
      const matchedProduct = allProducts.find((prod) => prod._id === product._id);
      if (matchedProduct) {
        if (matchedProduct.stockLevel < product.quantity) {
          isStockAvailable = false;
          stockIssues.push(
            `For product "${matchedProduct.name}", only ${matchedProduct.stockLevel} items are available.`
          );
        }
      }
    }

    if (!isStockAvailable) {
      setStockError(stockIssues.join(", "));
    } else {
      setStockError(null);  // Reset stock error if all stock levels are sufficient
    }

    return isStockAvailable;
  }

// Update stock levels after successful payment
const updateStockLevels = async () => {
  if (Array.isArray(allProducts) && allProducts.length > 0) {
    for (const product of products) {
      const matchedProduct = allProducts.filter((prod) => prod._id === product._id)[0];
      if (matchedProduct) {
        // Subtract the quantity from the current stock level
        const newStockLevel = matchedProduct.stockLevel - product.quantity;
        
        // Ensure the new stock level is non-negative before updating
        if (newStockLevel >= 0) {
          const updateResponse = await updateProductStock(product._id, newStockLevel);
          if (updateResponse.success) {
            console.log(`Stock level updated for product ${product._id}`);
          } else {
            console.log(`Failed to update stock for product ${product._id}`);
          }
        } else {
          console.log(`Insufficient stock for product: ${product.name}`);
        }
      } else {
        console.log(`Product not found: ${product._id}`);
      }
    }
  } else {
    console.log('No products available or invalid product data');
  }
};

// Function to update stock level
const updateProductStock = async (productId, newStockLevel) => {
  try {
    console.log(`Updating stock for product ${productId} to ${newStockLevel}`);  // Log the update attempt

    const response = await fetch(`http://localhost:5000/api/products/update-product/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stockLevel: newStockLevel }),  // Send stockLevel in the request body
    });

    const data = await response.json();
    console.log("API Response:", data);  // Log the API response

    if (data && data.success) {
      return { success: true };
    } else {
      return { success: false, message: data.message || "Unknown error" };
    }
  } catch (error) {
    console.error("Error updating stock level:", error);
    return { success: false, message: error.message };
  }
};



  return (
    <div className="bg-black border border-gray-700 mt-5 rounded text-base">
      <div className="px-6 py-4 space-y-5">
        <h1 className="text-2xl font-bold text-white">Order Summary</h1>
        <p className="text-dark mt-2">
          <span className="text-white">Selected Items:</span> {selectedItems}
        </p>
        <p className="text-dark mt-2">
          <span className="text-white">Total Price:</span> ${totalPrice.toFixed(2)}
        </p>
        <p className="text-dark mt-2">
          <span className="text-white">Tax ({taxRate * 100}%) :</span> ${tax.toFixed(2)}
        </p>
        <h3 className="font-semibold text-dark mt-4">
          <span className="text-white">Grand Total:</span> ${grandTotal.toFixed(2)}
        </h3>
        <div className="mt-4">
          <h4 className="text-white">Product IDs:</h4>
          <ul className="text-white">
            {products.map((product) => (
              <li key={product._id}>{product._id}</li>
            ))}
          </ul>
        </div>
      </div>
      {stockError && <div className="text-red-500 px-3 py-1.5">{stockError}</div>}
      <div className="px-4 pb-6">
        <button
          onClick={handleClearCart}
          className="bg-gray-400 text-white hover:bg-white hover:text-black px-3 py-1.5 text-white mt-2 rounded-md flex justify-between items-center mb-4"
        >
          <span className="mr-2">Clear Cart</span>
          <i className="ri-delete-bin-7-line"></i>
        </button>
        <button
          onClick={makePayment}
          className="bg-white text-black px-3 py-1.5 hover:bg-gray-300 mt-2 rounded-md flex justify-between items-center"
        >
          <span className="mr-2">Proceed to Checkout</span>
          <i className="ri-bank-card-line"></i>
        </button>
      </div>
      {error && <div className="text-red-500 px-3 py-1.5 ">{error}</div>}
    </div>
  );
};

export default OrderSummary;
