import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, updateQty, clearCart } from "@/redux/reducers/cartSlice";
import { selectCartItems, selectCartTotal, selectCartCount } from "@/redux/selectors/cartSelectors";
import { setCartDrawerOpen } from "@/redux/reducers/uiSlice";
import type { CartItem } from "@/types/cart";

export function useCart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartCount);

  return {
    items,
    total,
    count,
    addToCart: (item: CartItem) => {
      dispatch(addItem(item));
      dispatch(setCartDrawerOpen(true));
    },
    removeFromCart: (productId: string, color: string, size: string) =>
      dispatch(removeItem({ productId, color, size })),
    updateQuantity: (productId: string, color: string, size: string, quantity: number) =>
      dispatch(updateQty({ productId, color, size, quantity })),
    clear: () => dispatch(clearCart()),
  };
}
