import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cart.service';
import { wishlistService } from '../services/wishlist.service';
import { couponService } from '../services/coupon.service';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);   // full course objects
  const [wishlistItems, setWishlistItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch cart and wishlist from Supabase when user changes
  useEffect(() => {
    const loadCartAndWishlist = async () => {
      if (!user) {
        setCartItems([]);
        setWishlistItems([]);
        return;
      }
      setLoading(true);
      try {
        const [cartData, wishlistData] = await Promise.all([
          cartService.getCart(user.id),
          wishlistService.getWishlist(user.id),
        ]);
        // cartData rows have shape: { id, course_id, courses: {...} }
        setCartItems((cartData || []).map(row => row.courses || row).filter(Boolean));
        setWishlistItems((wishlistData || []).map(row => row.courses || row).filter(Boolean));
      } catch (err) {
        console.error('Failed to load cart/wishlist:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCartAndWishlist();
  }, [user]);

  const addToCart = async (courseId) => {
    if (!user) {
      // Guest: optimistically push courseId (no full object available, handled at display)
      return;
    }
    try {
      await cartService.addToCart(user.id, courseId);
      const updatedCart = await cartService.getCart(user.id);
      setCartItems((updatedCart || []).map(row => row.courses || row).filter(Boolean));
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const removeFromCart = async (courseId) => {
    if (!user) return;
    try {
      await cartService.removeFromCart(user.id, courseId);
      setCartItems(prev => prev.filter(c => c.id !== courseId));
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const addToWishlist = async (courseId) => {
    if (!user) return;
    try {
      await wishlistService.addToWishlist(user.id, courseId);
      const updatedWishlist = await wishlistService.getWishlist(user.id);
      setWishlistItems((updatedWishlist || []).map(row => row.courses || row).filter(Boolean));
    } catch (err) {
      console.error('Error adding to wishlist:', err);
    }
  };

  const removeFromWishlist = async (courseId) => {
    if (!user) return;
    try {
      await wishlistService.removeFromWishlist(user.id, courseId);
      setWishlistItems(prev => prev.filter(c => c.id !== courseId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  const applyCoupon = async (code) => {
    try {
      const validCoupon = await couponService.validateCoupon(code);
      setCoupon(validCoupon);
      return validCoupon;
    } catch (err) {
      setCoupon(null);
      throw err;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const clearCart = async () => {
    setCartItems([]);
    setCoupon(null);
    if (user) {
      try {
        await cartService.clearCart(user.id);
      } catch (err) {
        console.error('Error clearing cart:', err);
      }
    }
  };

  const cartIds = cartItems.map(c => c.id);
  const wishlistIds = wishlistItems.map(c => c.id);

  // Price calculations
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.discount_price ?? item.price ?? 0;
    return sum + Number(price);
  }, 0);
  const discount = coupon ? (subtotal * (coupon.discount_percent || coupon.discountPercent || 0)) / 100 : 0;
  const tax = (subtotal - discount) * 0.05; // 5% tax
  const total = Math.max(0, subtotal - discount + tax);

  return (
    <CartContext.Provider
      value={{
        cartIds,
        wishlistIds,
        cartItems,
        wishlistItems,
        coupon,
        loading,
        subtotal: parseFloat(subtotal.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        addToCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        applyCoupon,
        removeCoupon,
        clearCart,
        isInCart: (courseId) => cartIds.includes(courseId),
        isInWishlist: (courseId) => wishlistIds.includes(courseId),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
