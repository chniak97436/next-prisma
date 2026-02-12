'use client';

import { CartProvider } from './components/CartContext';

export function Providers({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
