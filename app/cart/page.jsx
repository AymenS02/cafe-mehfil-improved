'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartItemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const total = getCartTotal();
  const itemCount = getCartItemCount();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-bg py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-fg mb-2">Shopping Cart</h1>
          <p className="text-secondary">
            {itemCount > 0 ? `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-secondary/10">
            <ShoppingCart className="w-16 h-16 text-secondary/40 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-fg mb-2">Your cart is empty</h2>
            <p className="text-secondary mb-6">Add some products from our shop to get started</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-bg font-semibold rounded-lg hover:bg-accent transition-colors shadow-md"
            >
              Browse Shop
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md p-6 border border-secondary/10 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 bg-bg rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-fg mb-1 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-secondary mb-3 truncate">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-bg hover:bg-secondary/10 rounded-lg transition-colors border border-secondary/20"
                          >
                            <Minus className="w-4 h-4 text-fg" />
                          </button>
                          <span className="w-8 text-center font-semibold text-fg">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-bg hover:bg-secondary/10 rounded-lg transition-colors border border-secondary/20"
                          >
                            <Plus className="w-4 h-4 text-fg" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-lg font-bold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 h-fit hover:bg-red-50 rounded-lg transition-colors group"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5 text-secondary group-hover:text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary/10 sticky top-8">
                <h2 className="text-xl font-bold text-fg mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-secondary">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-secondary/20 pt-3">
                    <div className="flex justify-between text-lg font-bold text-fg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-bg font-semibold rounded-lg hover:bg-accent transition-colors shadow-md hover:shadow-lg"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>

                {!isAuthenticated && (
                  <p className="text-xs text-secondary text-center mt-3">
                    You'll need to sign in or create an account
                  </p>
                )}

                <Link
                  href="/shop"
                  className="block text-center text-secondary hover:text-primary transition-colors mt-4"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
