import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
  total: number;
  count: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
  count: 0,
};

function recalculate(state: CartState) {
  state.count = state.items.reduce((sum, i) => sum + i.quantity, 0);
  state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.color === action.payload.color &&
          i.size === action.payload.size
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push({ ...action.payload });
      }
      recalculate(state);
    },
    removeItem(
      state,
      action: PayloadAction<{ productId: string; color: string; size: string }>
    ) {
      state.items = state.items.filter(
        (i) =>
          !(
            i.productId === action.payload.productId &&
            i.color === action.payload.color &&
            i.size === action.payload.size
          )
      );
      recalculate(state);
    },
    updateQty(
      state,
      action: PayloadAction<{
        productId: string;
        color: string;
        size: string;
        quantity: number;
      }>
    ) {
      const item = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.color === action.payload.color &&
          i.size === action.payload.size
      );
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
      recalculate(state);
    },
    clearCart(state) {
      state.items = [];
      state.total = 0;
      state.count = 0;
    },
  },
});

export const { addItem, removeItem, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
