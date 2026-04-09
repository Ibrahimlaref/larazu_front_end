import type { RootState } from "../store";

export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectIsInWishlist = (id: string) => (state: RootState) =>
  state.wishlist.items.some((i) => i.id === id);
