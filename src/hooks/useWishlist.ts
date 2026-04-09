import { useDispatch, useSelector } from "react-redux";
import { toggleItem } from "@/redux/reducers/wishlistSlice";
import { selectWishlistItems, selectIsInWishlist } from "@/redux/selectors/productSelectors";
import type { Product } from "@/types/product";

export function useWishlist() {
  const dispatch = useDispatch();
  const items = useSelector(selectWishlistItems);

  return {
    items,
    isInWishlist: (id: string) => items.some((i) => i.id === id),
    useIsInWishlist: (id: string) => useSelector(selectIsInWishlist(id)),
    toggle: (product: Product) => dispatch(toggleItem(product)),
  };
}
