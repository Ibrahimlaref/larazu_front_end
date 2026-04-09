import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { setCartDrawerOpen } from "@/redux/reducers/uiSlice";
import { useCart } from "@/hooks/useCart";
import type { RootState } from "@/redux/store";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const open = useSelector((s: RootState) => s.ui.cartDrawerOpen);
  const { items, total, count, removeFromCart, updateQuantity } = useCart();

  const close = () => dispatch(setCartDrawerOpen(false));

  return (
    <Sheet open={open} onOpenChange={(v) => dispatch(setCartDrawerOpen(v))}>
      <SheetContent className="w-full sm:max-w-md bg-chalk flex flex-col">
        <SheetHeader>
          <SheetTitle className="heading-display text-2xl">
            Your Cart ({count})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <p className="text-mist">Your cart is empty</p>
            <Button
              onClick={() => { close(); navigate("/shop"); }}
              className="bg-rust text-white hover:bg-rust/90 label-mono"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {items.map((item) => (
                <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover bg-stone"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-mist mt-0.5">
                          {item.color} / {item.size}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId, item.color, item.size)}
                        className="text-mist hover:text-ink"
                        aria-label="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-stone">
                        <button
                          className="p-1.5 hover:bg-stone"
                          onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-mono">{item.quantity}</span>
                        <button
                          className="p-1.5 hover:bg-stone"
                          onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-semibold text-sm">
                        {(item.price * item.quantity).toLocaleString()} DZD
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />
            <div className="space-y-3 pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{total.toLocaleString()} DZD</span>
              </div>
              <Button
                className="w-full bg-rust text-white hover:bg-rust/90 label-mono py-6"
                onClick={() => { close(); navigate("/checkout"); }}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full border-ink text-ink label-mono"
                onClick={() => { close(); navigate("/cart"); }}
              >
                View Cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
