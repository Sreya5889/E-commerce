import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../services/db';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartIds, setCartIds] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [courses, setCourses] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load all available courses for lookup
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await db.getCourses();
        setCourses(data);
      } catch (err) {
        console.error('Failed to load courses for cart:', err);
      }
    };
    fetchCourses();
  }, []);

  // Fetch cart and wishlist when user logs in/out
  useEffect(() => {
    const loadCartAndWishlist = async () => {
      if (!user) {
        setCartIds([]);
        setWishlistIds([]);
        return;
      }
      setLoading(true);
      try {
        const [cIds, wIds] = await Promise.all([
          db.getCart(user.id),
          db.getWishlist(user.id),
        ]);
        setCartIds(cIds || []);
        setWishlistIds(wIds || []);
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
      // Local cart for guest users
      setCartIds(prev => prev.includes(courseId) ? prev : [...prev, courseId]);
      return;
    }
    try {
      const updated = await db.addToCart(user.id, courseId);
      setCartIds(updated || []);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const removeFromCart = async (courseId) => {
    if (!user) {
      setCartIds(prev => prev.filter(id => id !== courseId));
      return;
    }
    try {
      const updated = await db.removeFromCart(user.id, courseId);
      setCartIds(updated || []);
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const addToWishlist = async (courseId) => {
    if (!user) {
      setWishlistIds(prev => prev.includes(courseId) ? prev : [...prev, courseId]);
      return;
    }
    try {
      const updated = await db.addToWishlist(user.id, courseId);
      setWishlistIds(updated || []);
    } catch (err) {
      console.error('Error adding to wishlist:', err);
    }
  };

  const removeFromWishlist = async (courseId) => {
    if (!user) {
      setWishlistIds(prev => prev.filter(id => id !== courseId));
      return;
    }
    try {
      const updated = await db.removeFromWishlist(user.id, courseId);
      setWishlistIds(updated || []);
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  const applyCoupon = async (code) => {
    try {
      const validCoupon = await db.validateCoupon(code);
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

  const clearCart = () => {
    setCartIds([]);
    setCoupon(null);
  };

  // Derive cart courses details
  const cartItems = courses.filter(c => cartIds.includes(c.id));
  const wishlistItems = courses.filter(c => wishlistIds.includes(c.id));

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.discountPrice || item.price), 0);
  const discount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
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
