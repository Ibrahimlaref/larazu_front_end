import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  cartDrawerOpen: boolean;
  searchModalOpen: boolean;
  mobileMenuOpen: boolean;
}

const initialState: UiState = {
  cartDrawerOpen: false,
  searchModalOpen: false,
  mobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleCartDrawer(state) {
      state.cartDrawerOpen = !state.cartDrawerOpen;
    },
    setCartDrawerOpen(state, action) {
      state.cartDrawerOpen = action.payload;
    },
    toggleSearchModal(state) {
      state.searchModalOpen = !state.searchModalOpen;
    },
    setSearchModalOpen(state, action) {
      state.searchModalOpen = action.payload;
    },
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen(state, action) {
      state.mobileMenuOpen = action.payload;
    },
  },
});

export const {
  toggleCartDrawer,
  setCartDrawerOpen,
  toggleSearchModal,
  setSearchModalOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
} = uiSlice.actions;
export default uiSlice.reducer;
