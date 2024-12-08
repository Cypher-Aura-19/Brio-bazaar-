import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";
import authApi from './features/auth/authApi';
import { authReducer, sellerAuthReducer } from './features/auth/authSlice'; // Corrected import
import orderApi from "./features/orders/orderApi";
import reviewApi from "./features/reviews/reviewApi";
import statsApi from "./features/stats/statsApi";
import productsApi from "./features/products/productsApi";
import sellerApi from './features/sellers/sellerApi';
import promotionApi from './features/promotion/discountPromotionApi';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,  // User authentication state
    sellerAuth: sellerAuthReducer, // Seller authentication state
    [productsApi.reducerPath]: productsApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [statsApi.reducerPath]: statsApi.reducer,
    [sellerApi.reducerPath]: sellerApi.reducer,
    [promotionApi.reducerPath]: promotionApi.reducer, // Add promotionApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware, 
      productsApi.middleware, 
      orderApi.middleware, 
      reviewApi.middleware, 
      statsApi.middleware, 
      sellerApi.middleware,
      promotionApi.middleware // Add promotionApi middleware
    ),
});
