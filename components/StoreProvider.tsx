"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Order } from "@/lib/types";
import { computeTotals, validateCoupon, type Totals } from "@/lib/pricing";

interface State {
  lines: CartLine[];
  wishlist: string[];
  coupon?: string;
  orders: Order[];
  hydrated: boolean;
}

type Action =
  | { type: "hydrate"; payload: Partial<State> }
  | { type: "add"; line: Omit<CartLine, "qty">; qty: number }
  | { type: "qty"; key: string; qty: number }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "coupon"; code?: string }
  | { type: "wish"; id: string }
  | { type: "order"; order: Order };

const STORAGE_KEY = "islate.store.v1";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { ...state, ...action.payload, hydrated: true };
    case "add": {
      const existing = state.lines.find((l) => l.key === action.line.key);
      const lines = existing
        ? state.lines.map((l) =>
            l.key === action.line.key ? { ...l, qty: Math.min(l.qty + action.qty, 99) } : l,
          )
        : [...state.lines, { ...action.line, qty: action.qty }];
      return { ...state, lines };
    }
    case "qty":
      return {
        ...state,
        lines: state.lines
          .map((l) => (l.key === action.key ? { ...l, qty: Math.min(action.qty, 99) } : l))
          .filter((l) => l.qty > 0),
      };
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.key !== action.key) };
    case "clear":
      return { ...state, lines: [], coupon: undefined };
    case "coupon":
      return { ...state, coupon: action.code };
    case "wish":
      return {
        ...state,
        wishlist: state.wishlist.includes(action.id)
          ? state.wishlist.filter((w) => w !== action.id)
          : [...state.wishlist, action.id],
      };
    case "order":
      return { ...state, orders: [action.order, ...state.orders], lines: [], coupon: undefined };
  }
}

interface StoreContext {
  hydrated: boolean;
  lines: CartLine[];
  count: number;
  totals: Totals;
  coupon?: string;
  orders: Order[];
  wishlist: string[];
  drawerOpen: boolean;
  searchOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  addToCart: (line: Omit<CartLine, "qty">, qty?: number, openDrawer?: boolean) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  toggleWishlist: (productId: string) => void;
  saveOrder: (order: Order) => void;
}

const Ctx = createContext<StoreContext | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    lines: [],
    wishlist: [],
    orders: [],
    hydrated: false,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      dispatch({ type: "hydrate", payload: raw ? JSON.parse(raw) : {} });
    } catch {
      dispatch({ type: "hydrate", payload: {} });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      const { lines, wishlist, coupon, orders } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, wishlist, coupon, orders }));
    } catch {
      /* storage unavailable, the store still works for this session */
    }
  }, [state]);

  const addToCart = useCallback<StoreContext["addToCart"]>((line, qty = 1, openDrawer = true) => {
    dispatch({ type: "add", line, qty });
    if (openDrawer) setDrawerOpen(true);
  }, []);

  const applyCoupon = useCallback((code: string) => {
    if (!validateCoupon(code)) return false;
    dispatch({ type: "coupon", code: code.trim().toUpperCase() });
    return true;
  }, []);

  const value = useMemo<StoreContext>(
    () => ({
      hydrated: state.hydrated,
      lines: state.lines,
      count: state.lines.reduce((n, l) => n + l.qty, 0),
      totals: computeTotals(state.lines, state.coupon),
      coupon: state.coupon,
      orders: state.orders,
      wishlist: state.wishlist,
      drawerOpen,
      searchOpen,
      setDrawerOpen,
      setSearchOpen,
      addToCart,
      setQty: (key, qty) => dispatch({ type: "qty", key, qty }),
      removeLine: (key) => dispatch({ type: "remove", key }),
      clearCart: () => dispatch({ type: "clear" }),
      applyCoupon,
      removeCoupon: () => dispatch({ type: "coupon" }),
      toggleWishlist: (id) => dispatch({ type: "wish", id }),
      saveOrder: (order) => dispatch({ type: "order", order }),
    }),
    [state, drawerOpen, searchOpen, addToCart, applyCoupon],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
