import { create } from 'zustand';
import { Product } from '@shared/schema';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  verificationCode: string | null;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setVerificationCode: (code: string) => void;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  verificationCode: null,
  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.product.id === product.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { 
        ...state,
        items: [...state.items, { product, quantity: 1 }] 
      };
    });
  },
  removeItem: (productId) => {
    set((state) => ({
      ...state,
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      ...state,
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  },
  clearCart: () => set((state) => ({ ...state, items: [], verificationCode: null })),
  setVerificationCode: (code) => set((state) => ({ ...state, verificationCode: code })),
  total: () => {
    return get().items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
  },
}));