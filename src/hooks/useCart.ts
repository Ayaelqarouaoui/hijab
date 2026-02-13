import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { CartItem, Product } from '../lib/supabase';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingCost, setShippingCost] = useState(0);

  const SHIPPING_THRESHOLD = 300;
  const SHIPPING_COST = 50;

  useEffect(() => {
    const id = localStorage.getItem('chalher_session_id') || `session_${Date.now()}_${Math.random()}`;
    localStorage.setItem('chalher_session_id', id);
    setSessionId(id);

    const savedPayment = localStorage.getItem('chalher_payment_method');
    if (savedPayment) setPaymentMethod(savedPayment);

    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const fetchCart = useCallback(async () => {
    if (!sessionId) return;
    const { data } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_session_id', sessionId);
    if (data) setCartItems(data);
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) fetchCart();
  }, [sessionId, fetchCart]);

  const addToCart = async (productId: string, message?: string) => {
    if (!sessionId) return;

    const existing = cartItems.find(
      (item) => item.product_id === productId && item.message === (message || null)
    );

    if (existing) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + 1, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
      if (!error) await fetchCart();
    } else {
      const { error } = await supabase.from('cart_items').insert({
        user_session_id: sessionId,
        product_id: productId,
        quantity: 1,
        message: message || null,
      });
      if (!error) await fetchCart();
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    await supabase.from('cart_items').delete().eq('id', cartItemId);
    await fetchCart();
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
    } else {
      await supabase
        .from('cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', cartItemId);
      await fetchCart();
    }
  };

  const getSubtotal = useCallback(() => {
    return cartItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.product_id);
      return sum + ((product?.price || 54.95) * item.quantity);
    }, 0);
  }, [cartItems, products]);

  useEffect(() => {
    const subtotal = getSubtotal();
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    setShippingCost(shipping);
  }, [getSubtotal]);

  const updatePaymentMethod = (method: string) => {
    setPaymentMethod(method);
    localStorage.setItem('chalher_payment_method', method);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getSubtotal();
  const total = subtotal + shippingCost;

  return {
    cartItems,
    sessionId,
    products,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartCount,
    fetchCart,
    paymentMethod,
    updatePaymentMethod,
    subtotal,
    shippingCost,
    total,
    SHIPPING_THRESHOLD,
  };
};
