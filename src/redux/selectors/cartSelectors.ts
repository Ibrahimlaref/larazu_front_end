import type { RootState } from "../store";

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectCartCount = (state: RootState) => state.cart.count;
