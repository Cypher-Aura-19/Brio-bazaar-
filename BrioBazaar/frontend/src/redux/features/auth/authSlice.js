import { createSlice } from '@reduxjs/toolkit';

// Utility function to clear conflicting data in localStorage
const clearConflictingData = () => {
  console.log("Clearing conflicting data from localStorage.");
  localStorage.removeItem('user');
  localStorage.removeItem('seller');
  localStorage.removeItem('someOtherConflictingData'); // You can add more items as needed
};

// Utility function to load user from localStorage
const loadUserFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('user');
    if (serializedState === null) {
      console.log("No user found in localStorage.");
      return { user: null };
    }
    console.log("Loading user from localStorage:", serializedState);
    return { user: JSON.parse(serializedState) };
  } catch (err) {
    console.error("Failed to load user from localStorage:", err);
    return { user: null };
  }
};

// Utility function to load seller from localStorage
const loadSellerFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('seller');
    if (serializedState === null) {
      console.log("No seller found in localStorage.");
      return { seller: null };
    }
    console.log("Loading seller from localStorage:", serializedState);
    return { seller: JSON.parse(serializedState) };
  } catch (err) {
    console.error("Failed to load seller from localStorage:", err);
    return { seller: null };
  }
};

// Auth slice for user
const authSlice = createSlice({
  name: 'auth',
  initialState: loadUserFromLocalStorage(),
  reducers: {
    setUser: (state, action) => {
      console.log("Setting user:", action.payload.user);
      clearConflictingData(); // Clear conflicting data before setting the user
      state.user = action.payload.user;
      localStorage.setItem('user', JSON.stringify(state.user));
      console.log("User saved to localStorage:", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
      console.log("User logged out and removed from localStorage.");
      clearConflictingData(); // Ensure conflicting data is cleared on logout
    },
  },
});

// SellerAuth slice for seller
const sellerAuthSlice = createSlice({
  name: 'sellerAuth',
  initialState: loadSellerFromLocalStorage(),
  reducers: {
    setSeller: (state, action) => {
      console.log("Setting seller:", action.payload.seller);
      clearConflictingData(); // Clear conflicting data before setting the seller
      state.seller = action.payload.seller;
      localStorage.setItem('seller', JSON.stringify(state.seller));
      console.log("Seller saved to localStorage:", JSON.stringify(state.seller));
    },
    logoutSeller: (state) => {
      state.seller = null;
      localStorage.removeItem('seller');
      console.log("Seller logged out and removed from localStorage.");
      clearConflictingData(); // Ensure conflicting data is cleared on seller logout
    },
  },
});

// Export actions and reducers separately
export const { setUser, logout } = authSlice.actions;
export const { setSeller, logoutSeller } = sellerAuthSlice.actions;

// Export the reducers separately
export const authReducer = authSlice.reducer;
export const sellerAuthReducer = sellerAuthSlice.reducer;
